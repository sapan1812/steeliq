from __future__ import annotations

import uuid
from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, Field

MicroAppStatusLiteral = Literal["active", "beta", "dev", "disabled"]
DataSourceTypeLiteral = Literal["iba", "l2", "rest", "opc_ua", "mqtt", "sql"]
DataSourceStatusLiteral = Literal["connected", "disconnected", "error", "untested"]

UserRoleLiteral = Literal[
    "super_admin",
    "plant_manager",
    "castx_operator",
    "eaf_operator",
    "dri_operator",
]


# ──────────────────────────────────────────────────────────────────────────────
# MicroApp
# ──────────────────────────────────────────────────────────────────────────────


class MicroAppOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    name: str
    tagline: str
    version: str
    vendor: str
    icon: str
    color: str
    mount_key: str
    status: MicroAppStatusLiteral
    stage: str
    health_pct: int
    instances: int
    manifest_url: Optional[str]
    deployed_at: Optional[datetime]
    allowed_roles: List[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_orm_with_roles(cls, microapp) -> "MicroAppOut":
        data = {
            "id": microapp.id,
            "name": microapp.name,
            "tagline": microapp.tagline,
            "version": microapp.version,
            "vendor": microapp.vendor,
            "icon": microapp.icon,
            "color": microapp.color,
            "mount_key": microapp.mount_key,
            "status": microapp.status,
            "stage": microapp.stage,
            "health_pct": microapp.health_pct,
            "instances": microapp.instances,
            "manifest_url": microapp.manifest_url,
            "deployed_at": microapp.deployed_at,
            "allowed_roles": [r.role for r in microapp.allowed_roles],
            "created_at": microapp.created_at,
            "updated_at": microapp.updated_at,
        }
        return cls(**data)


class MicroAppCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    tagline: str = Field(default="", max_length=512)
    version: str = Field(min_length=1, max_length=32)
    vendor: str = Field(default="EMsteel", max_length=255)
    icon: str = Field(default="", max_length=255)
    color: str = Field(default="#4F8EF7", pattern=r"^#[0-9A-Fa-f]{6}$")
    mount_key: str = Field(min_length=1, max_length=64)
    status: MicroAppStatusLiteral = "active"
    stage: str = Field(default="production", max_length=64)
    health_pct: int = Field(default=100, ge=0, le=100)
    instances: int = Field(default=1, ge=0)
    manifest_url: Optional[str] = None
    deployed_at: Optional[datetime] = None
    allowed_roles: List[UserRoleLiteral] = Field(default_factory=list)


class MicroAppUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    tagline: Optional[str] = Field(default=None, max_length=512)
    version: Optional[str] = Field(default=None, min_length=1, max_length=32)
    vendor: Optional[str] = Field(default=None, max_length=255)
    icon: Optional[str] = Field(default=None, max_length=255)
    color: Optional[str] = Field(default=None, pattern=r"^#[0-9A-Fa-f]{6}$")
    status: Optional[MicroAppStatusLiteral] = None
    stage: Optional[str] = Field(default=None, max_length=64)
    health_pct: Optional[int] = Field(default=None, ge=0, le=100)
    instances: Optional[int] = Field(default=None, ge=0)
    manifest_url: Optional[str] = None
    deployed_at: Optional[datetime] = None
    allowed_roles: Optional[List[UserRoleLiteral]] = None


# ──────────────────────────────────────────────────────────────────────────────
# DataSource
# ──────────────────────────────────────────────────────────────────────────────


class DataSourceOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    name: str
    type: DataSourceTypeLiteral
    host: str
    port: Optional[int]
    username: Optional[str]
    # password_enc is intentionally excluded from output
    connection_mode: str
    is_active: bool
    last_tested_at: Optional[datetime]
    status: DataSourceStatusLiteral
    created_at: datetime
    updated_at: datetime


class DataSourceCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    type: DataSourceTypeLiteral
    host: str = Field(min_length=1, max_length=255)
    port: Optional[int] = Field(default=None, ge=1, le=65535)
    username: Optional[str] = Field(default=None, max_length=255)
    password: Optional[str] = None
    connection_mode: str = Field(default="pull", max_length=64)
    is_active: bool = True


class DataSourceTestResult(BaseModel):
    connected: bool
    latency_ms: int
    message: str
