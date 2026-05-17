from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.database import Base

# ──────────────────────────────────────────────────────────────────────────────
# Shared enums
# ──────────────────────────────────────────────────────────────────────────────

MicroAppStatus = Enum(
    "active", "beta", "dev", "disabled",
    name="microapp_status",
)

DataSourceType = Enum(
    "iba", "l2", "rest", "opc_ua", "mqtt", "sql",
    name="datasource_type",
)

DataSourceStatus = Enum(
    "connected", "disconnected", "error", "untested",
    name="datasource_status",
)

# Mirrors the user role enum (separate SA Enum object so they share the PG type name)
MicroAppRoleEnum = Enum(
    "super_admin",
    "plant_manager",
    "castx_operator",
    "eaf_operator",
    "dri_operator",
    name="user_role",  # same PG type as in users table
    create_type=False,  # do NOT create; already created by user model
)


# ──────────────────────────────────────────────────────────────────────────────
# Models
# ──────────────────────────────────────────────────────────────────────────────


class MicroApp(Base):
    __tablename__ = "microapps"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    tagline: Mapped[str] = mapped_column(String(512), nullable=False, default="")
    version: Mapped[str] = mapped_column(String(32), nullable=False)
    vendor: Mapped[str] = mapped_column(String(255), nullable=False, default="EMsteel")
    icon: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    color: Mapped[str] = mapped_column(String(7), nullable=False, default="#4F8EF7")
    mount_key: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    status: Mapped[str] = mapped_column(MicroAppStatus, nullable=False, default="active")
    stage: Mapped[str] = mapped_column(String(64), nullable=False, default="production")
    health_pct: Mapped[int] = mapped_column(Integer, nullable=False, default=100)
    instances: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    manifest_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    deployed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    allowed_roles: Mapped[list[MicroAppRole]] = relationship(
        "MicroAppRole", back_populates="microapp", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<MicroApp {self.name} v{self.version}>"


class MicroAppRole(Base):
    """Many-to-many: which roles can access a given MicroApp."""

    __tablename__ = "microapp_roles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    microapp_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("microapps.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    role: Mapped[str] = mapped_column(MicroAppRoleEnum, nullable=False)

    # Relationships
    microapp: Mapped[MicroApp] = relationship("MicroApp", back_populates="allowed_roles")

    def __repr__(self) -> str:  # pragma: no cover
        return f"<MicroAppRole microapp_id={self.microapp_id} role={self.role}>"


class DataSource(Base):
    __tablename__ = "data_sources"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(DataSourceType, nullable=False)
    host: Mapped[str] = mapped_column(String(255), nullable=False)
    port: Mapped[int | None] = mapped_column(Integer, nullable=True)
    username: Mapped[str | None] = mapped_column(String(255), nullable=True)
    password_enc: Mapped[str | None] = mapped_column(Text, nullable=True)
    connection_mode: Mapped[str] = mapped_column(String(64), nullable=False, default="pull")
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    last_tested_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    status: Mapped[str] = mapped_column(DataSourceStatus, nullable=False, default="untested")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<DataSource {self.name} type={self.type}>"


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    action: Mapped[str] = mapped_column(String(128), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(128), nullable=False)
    resource_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    detail: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="audit_logs")

    def __repr__(self) -> str:  # pragma: no cover
        return f"<AuditLog action={self.action} resource={self.resource_type}/{self.resource_id}>"
