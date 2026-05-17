from __future__ import annotations

import random
import time
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user, require_role
from app.db.database import get_db
from app.models.module import AuditLog, DataSource, MicroApp, MicroAppRole
from app.models.user import User
from app.schemas.module import (
    DataSourceCreate,
    DataSourceOut,
    DataSourceTestResult,
    MicroAppCreate,
    MicroAppOut,
    MicroAppUpdate,
)

router = APIRouter(prefix="/modules", tags=["modules"])


# ──────────────────────────────────────────────────────────────────────────────
# MicroApp endpoints
# ──────────────────────────────────────────────────────────────────────────────


@router.get("/", response_model=list[MicroAppOut])
async def list_microapps(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[MicroAppOut]:
    """Return microapps the current user's role can access."""
    result = await db.execute(
        select(MicroApp)
        .options(selectinload(MicroApp.allowed_roles))
        .order_by(MicroApp.name)
    )
    apps = result.scalars().all()

    # super_admin sees everything; other roles only see apps with their role listed
    visible: list[MicroAppOut] = []
    for app in apps:
        if current_user.role == "super_admin":
            visible.append(MicroAppOut.from_orm_with_roles(app))
        else:
            role_names = [r.role for r in app.allowed_roles]
            if current_user.role in role_names:
                visible.append(MicroAppOut.from_orm_with_roles(app))

    return visible


@router.post("/", response_model=MicroAppOut, status_code=status.HTTP_201_CREATED)
async def register_microapp(
    body: MicroAppCreate,
    current_user: User = Depends(require_role("super_admin")),
    db: AsyncSession = Depends(get_db),
) -> MicroAppOut:
    """Register a new microapp (super_admin only)."""
    existing = await db.execute(
        select(MicroApp).where(MicroApp.mount_key == body.mount_key)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A microapp with mount_key '{body.mount_key}' already exists",
        )

    app = MicroApp(
        name=body.name,
        tagline=body.tagline,
        version=body.version,
        vendor=body.vendor,
        icon=body.icon,
        color=body.color,
        mount_key=body.mount_key,
        status=body.status,
        stage=body.stage,
        health_pct=body.health_pct,
        instances=body.instances,
        manifest_url=body.manifest_url,
        deployed_at=body.deployed_at,
    )
    db.add(app)
    await db.flush()

    for role_name in body.allowed_roles:
        db.add(MicroAppRole(microapp_id=app.id, role=role_name))
    await db.flush()
    await db.refresh(app, ["allowed_roles"])

    return MicroAppOut.from_orm_with_roles(app)


@router.get("/{module_id}", response_model=MicroAppOut)
async def get_microapp(
    module_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MicroAppOut:
    """Get microapp detail by ID."""
    result = await db.execute(
        select(MicroApp)
        .options(selectinload(MicroApp.allowed_roles))
        .where(MicroApp.id == module_id)
    )
    app = result.scalar_one_or_none()
    if app is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="MicroApp not found")

    if current_user.role != "super_admin":
        role_names = [r.role for r in app.allowed_roles]
        if current_user.role not in role_names:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return MicroAppOut.from_orm_with_roles(app)


@router.patch("/{module_id}", response_model=MicroAppOut)
async def update_microapp(
    module_id: uuid.UUID,
    body: MicroAppUpdate,
    current_user: User = Depends(require_role("super_admin")),
    db: AsyncSession = Depends(get_db),
) -> MicroAppOut:
    """Update microapp metadata (super_admin only)."""
    result = await db.execute(
        select(MicroApp)
        .options(selectinload(MicroApp.allowed_roles))
        .where(MicroApp.id == module_id)
    )
    app = result.scalar_one_or_none()
    if app is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="MicroApp not found")

    update_data = body.model_dump(exclude_unset=True)
    new_roles = update_data.pop("allowed_roles", None)

    for field, value in update_data.items():
        setattr(app, field, value)

    if new_roles is not None:
        for r in list(app.allowed_roles):
            await db.delete(r)
        await db.flush()
        for role_name in new_roles:
            db.add(MicroAppRole(microapp_id=app.id, role=role_name))

    await db.flush()
    await db.refresh(app, ["allowed_roles"])
    return MicroAppOut.from_orm_with_roles(app)


@router.post("/{module_id}/toggle", response_model=MicroAppOut)
async def toggle_microapp(
    module_id: uuid.UUID,
    current_user: User = Depends(require_role("super_admin")),
    db: AsyncSession = Depends(get_db),
) -> MicroAppOut:
    """Toggle a microapp between active and disabled (super_admin only)."""
    result = await db.execute(
        select(MicroApp)
        .options(selectinload(MicroApp.allowed_roles))
        .where(MicroApp.id == module_id)
    )
    app = result.scalar_one_or_none()
    if app is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="MicroApp not found")

    app.status = "disabled" if app.status == "active" else "active"
    await db.flush()
    await db.refresh(app, ["allowed_roles"])
    return MicroAppOut.from_orm_with_roles(app)


# ──────────────────────────────────────────────────────────────────────────────
# DataSource endpoints
# ──────────────────────────────────────────────────────────────────────────────


@router.get("/datasources", response_model=list[DataSourceOut])
async def list_datasources(
    current_user: User = Depends(require_role("super_admin", "plant_manager")),
    db: AsyncSession = Depends(get_db),
) -> list[DataSourceOut]:
    """List all data sources."""
    result = await db.execute(select(DataSource).order_by(DataSource.name))
    sources = result.scalars().all()
    return [DataSourceOut.model_validate(s) for s in sources]


@router.post("/datasources", response_model=DataSourceOut, status_code=status.HTTP_201_CREATED)
async def create_datasource(
    body: DataSourceCreate,
    current_user: User = Depends(require_role("super_admin")),
    db: AsyncSession = Depends(get_db),
) -> DataSourceOut:
    """Create a new data source connection (super_admin only)."""
    source = DataSource(
        name=body.name,
        type=body.type,
        host=body.host,
        port=body.port,
        username=body.username,
        password_enc=body.password,  # In production: encrypt before storing
        connection_mode=body.connection_mode,
        is_active=body.is_active,
        status="untested",
    )
    db.add(source)
    await db.flush()
    await db.refresh(source)
    return DataSourceOut.model_validate(source)


@router.post("/datasources/{ds_id}/test", response_model=DataSourceTestResult)
async def test_datasource(
    ds_id: uuid.UUID,
    current_user: User = Depends(require_role("super_admin", "plant_manager")),
    db: AsyncSession = Depends(get_db),
) -> DataSourceTestResult:
    """
    Simulate a connectivity test for the data source.

    In production this would attempt a real connection; here we return
    a plausible simulated result.
    """
    result = await db.execute(select(DataSource).where(DataSource.id == ds_id))
    source = result.scalar_one_or_none()
    if source is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data source not found")

    # Simulate network latency: IBA/L2 are local, REST/MQTT/OPC-UA vary
    latency_ranges = {
        "iba": (8, 25),
        "l2": (5, 18),
        "rest": (30, 120),
        "opc_ua": (12, 45),
        "mqtt": (10, 40),
        "sql": (15, 60),
    }
    lo, hi = latency_ranges.get(source.type, (20, 100))
    latency_ms = random.randint(lo, hi)

    # 95% success rate for active sources, 30% for inactive
    success_threshold = 0.95 if source.is_active else 0.30
    connected = random.random() < success_threshold

    now = datetime.now(tz=timezone.utc)
    source.last_tested_at = now
    source.status = "connected" if connected else "error"
    await db.flush()

    message = (
        f"Connection established in {latency_ms}ms"
        if connected
        else f"Connection refused by {source.host}"
    )
    return DataSourceTestResult(connected=connected, latency_ms=latency_ms, message=message)
