from __future__ import annotations

import logging
from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password_hash
from app.db.database import AsyncSessionLocal
from app.models.module import DataSource, MicroApp, MicroAppRole
from app.models.user import User

logger = logging.getLogger(__name__)


# ──────────────────────────────────────────────────────────────────────────────
# Demo data definitions
# ──────────────────────────────────────────────────────────────────────────────

DEMO_USERS = [
    {
        "email": "admin@emsteel.ae",
        "password": "Admin@123",
        "full_name": "System Administrator",
        "initials": "SA",
        "color": "#EF4444",
        "role": "super_admin",
    },
    {
        "email": "manager@emsteel.ae",
        "password": "Mgr@123",
        "full_name": "Plant Manager",
        "initials": "PM",
        "color": "#8B5CF6",
        "role": "plant_manager",
    },
    {
        "email": "castx@emsteel.ae",
        "password": "CastX@123",
        "full_name": "CastX Operator",
        "initials": "CX",
        "color": "#3B82F6",
        "role": "castx_operator",
    },
    {
        "email": "eaf@emsteel.ae",
        "password": "EAF@123",
        "full_name": "EAF Operator",
        "initials": "EO",
        "color": "#F59E0B",
        "role": "eaf_operator",
    },
    {
        "email": "dri@emsteel.ae",
        "password": "DRI@123",
        "full_name": "DRI Operator",
        "initials": "DO",
        "color": "#10B981",
        "role": "dri_operator",
    },
]

DEMO_MICROAPPS = [
    {
        "name": "CastX",
        "tagline": "Continuous Casting Quality Intelligence",
        "version": "2.4.1",
        "vendor": "EMsteel Digital",
        "icon": "layers",
        "color": "#3B82F6",
        "mount_key": "castx",
        "status": "active",
        "stage": "production",
        "health_pct": 98,
        "instances": 2,
        "manifest_url": "http://castx-app:3001/manifest.json",
        "deployed_at": datetime(2025, 3, 15, 8, 0, 0, tzinfo=timezone.utc),
        "allowed_roles": [
            "super_admin",
            "plant_manager",
            "castx_operator",
        ],
    },
    {
        "name": "EAF Monitor",
        "tagline": "Electric Arc Furnace Energy & Process Analytics",
        "version": "2.1.0",
        "vendor": "EMsteel Digital",
        "icon": "zap",
        "color": "#F59E0B",
        "mount_key": "eaf",
        "status": "active",
        "stage": "production",
        "health_pct": 100,
        "instances": 1,
        "manifest_url": "http://eaf-app:3002/manifest.json",
        "deployed_at": datetime(2025, 1, 22, 6, 30, 0, tzinfo=timezone.utc),
        "allowed_roles": [
            "super_admin",
            "plant_manager",
            "eaf_operator",
        ],
    },
    {
        "name": "DRI/DRP",
        "tagline": "Direct Reduction & Gas Process Optimization",
        "version": "1.8.0",
        "vendor": "EMsteel Digital",
        "icon": "flame",
        "color": "#10B981",
        "mount_key": "dri",
        "status": "active",
        "stage": "production",
        "health_pct": 95,
        "instances": 1,
        "manifest_url": "http://dri-app:3003/manifest.json",
        "deployed_at": datetime(2024, 11, 5, 10, 0, 0, tzinfo=timezone.utc),
        "allowed_roles": [
            "super_admin",
            "plant_manager",
            "dri_operator",
        ],
    },
]

DEMO_DATASOURCES = [
    {
        "name": "IBA Historian",
        "type": "iba",
        "host": "iba-historian.emsteel.local",
        "port": 3001,
        "username": "steeliq_ro",
        "password_enc": None,
        "connection_mode": "pull",
        "is_active": True,
        "status": "connected",
    },
    {
        "name": "Level-2 MES",
        "type": "l2",
        "host": "l2-mes.emsteel.local",
        "port": 5432,
        "username": "steeliq_mes",
        "password_enc": None,
        "connection_mode": "pull",
        "is_active": True,
        "status": "connected",
    },
]


# ──────────────────────────────────────────────────────────────────────────────
# Seed functions
# ──────────────────────────────────────────────────────────────────────────────


async def _seed_users(db: AsyncSession) -> None:
    count_result = await db.execute(select(func.count()).select_from(User))
    count = count_result.scalar_one()
    if count > 0:
        logger.info("Users table already populated – skipping user seed.")
        return

    for user_data in DEMO_USERS:
        user = User(
            email=user_data["email"],
            hashed_password=get_password_hash(user_data["password"]),
            full_name=user_data["full_name"],
            initials=user_data["initials"],
            color=user_data["color"],
            role=user_data["role"],
            is_active=True,
        )
        db.add(user)

    await db.flush()
    logger.info("Seeded %d demo users.", len(DEMO_USERS))


async def _seed_microapps(db: AsyncSession) -> None:
    count_result = await db.execute(select(func.count()).select_from(MicroApp))
    count = count_result.scalar_one()
    if count > 0:
        logger.info("MicroApps table already populated – skipping microapp seed.")
        return

    for app_data in DEMO_MICROAPPS:
        roles = app_data.pop("allowed_roles")
        app = MicroApp(**app_data)
        db.add(app)
        await db.flush()

        for role_name in roles:
            db.add(MicroAppRole(microapp_id=app.id, role=role_name))

        # Restore for next iteration safety (not strictly needed but keeps data pure)
        app_data["allowed_roles"] = roles

    await db.flush()
    logger.info("Seeded %d demo microapps.", len(DEMO_MICROAPPS))


async def _seed_datasources(db: AsyncSession) -> None:
    count_result = await db.execute(select(func.count()).select_from(DataSource))
    count = count_result.scalar_one()
    if count > 0:
        logger.info("DataSources table already populated – skipping datasource seed.")
        return

    for ds_data in DEMO_DATASOURCES:
        source = DataSource(**ds_data)
        db.add(source)

    await db.flush()
    logger.info("Seeded %d demo data sources.", len(DEMO_DATASOURCES))


async def seed_demo_data() -> None:
    """Entry point called by the FastAPI lifespan hook on startup."""
    async with AsyncSessionLocal() as db:
        try:
            await _seed_users(db)
            await _seed_microapps(db)
            await _seed_datasources(db)
            await db.commit()
            logger.info("Database seeding complete.")
        except Exception as exc:
            await db.rollback()
            logger.exception("Database seeding failed: %s", exc)
            raise
