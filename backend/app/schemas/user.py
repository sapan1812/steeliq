from __future__ import annotations

import uuid
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


# Valid role values kept in sync with the DB enum
UserRoleLiteral = Literal[
    "super_admin",
    "plant_manager",
    "castx_operator",
    "eaf_operator",
    "dri_operator",
]


class UserOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    email: EmailStr
    full_name: str
    initials: str
    color: str
    role: UserRoleLiteral
    is_active: bool
    created_at: datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str = Field(min_length=1, max_length=255)
    initials: str = Field(min_length=1, max_length=4)
    color: str = Field(default="#4F8EF7", pattern=r"^#[0-9A-Fa-f]{6}$")
    role: UserRoleLiteral


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    initials: Optional[str] = Field(default=None, min_length=1, max_length=4)
    color: Optional[str] = Field(default=None, pattern=r"^#[0-9A-Fa-f]{6}$")
    role: Optional[UserRoleLiteral] = None
    is_active: Optional[bool] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=6)


class PasswordReset(BaseModel):
    new_password: str = Field(min_length=6)
