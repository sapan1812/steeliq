from __future__ import annotations

import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_role
from app.core.security import get_password_hash, verify_password
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import (
    PasswordChange,
    PasswordReset,
    UserCreate,
    UserOut,
    UserUpdate,
)

router = APIRouter(prefix="/users", tags=["users"])


# ──────────────────────────────────────────────────────────────────────────────
# List users
# ──────────────────────────────────────────────────────────────────────────────


@router.get("/", response_model=dict)
async def list_users(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    role: Optional[str] = Query(default=None),
    is_active: Optional[bool] = Query(default=None),
    current_user: User = Depends(
        require_role("super_admin", "plant_manager")
    ),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """List users with optional filtering and pagination (plant_manager+ roles)."""
    query = select(User)
    if role:
        query = query.where(User.role == role)
    if is_active is not None:
        query = query.where(User.is_active == is_active)

    total_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = total_result.scalar_one()

    query = query.order_by(User.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    users = result.scalars().all()

    return {
        "items": [UserOut.model_validate(u) for u in users],
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size,
    }


# ──────────────────────────────────────────────────────────────────────────────
# Create user
# ──────────────────────────────────────────────────────────────────────────────


@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(
    body: UserCreate,
    current_user: User = Depends(require_role("super_admin")),
    db: AsyncSession = Depends(get_db),
) -> UserOut:
    """Create a new user (super_admin only)."""
    existing = await db.execute(select(User).where(User.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A user with email '{body.email}' already exists",
        )

    user = User(
        email=body.email,
        hashed_password=get_password_hash(body.password),
        full_name=body.full_name,
        initials=body.initials,
        color=body.color,
        role=body.role,
        is_active=True,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return UserOut.model_validate(user)


# ──────────────────────────────────────────────────────────────────────────────
# Get single user
# ──────────────────────────────────────────────────────────────────────────────


@router.get("/{user_id}", response_model=UserOut)
async def get_user(
    user_id: uuid.UUID,
    current_user: User = Depends(
        require_role("super_admin", "plant_manager")
    ),
    db: AsyncSession = Depends(get_db),
) -> UserOut:
    """Retrieve a user by ID."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserOut.model_validate(user)


# ──────────────────────────────────────────────────────────────────────────────
# Update user
# ──────────────────────────────────────────────────────────────────────────────


@router.patch("/{user_id}", response_model=UserOut)
async def update_user(
    user_id: uuid.UUID,
    body: UserUpdate,
    current_user: User = Depends(require_role("super_admin")),
    db: AsyncSession = Depends(get_db),
) -> UserOut:
    """Update user fields (super_admin only)."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    update_data = body.model_dump(exclude_unset=True)

    # Prevent email collision
    if "email" in update_data and update_data["email"] != user.email:
        conflict = await db.execute(
            select(User).where(User.email == update_data["email"])
        )
        if conflict.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already taken",
            )

    for field, value in update_data.items():
        setattr(user, field, value)

    await db.flush()
    await db.refresh(user)
    return UserOut.model_validate(user)


# ──────────────────────────────────────────────────────────────────────────────
# Deactivate user
# ──────────────────────────────────────────────────────────────────────────────


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_user(
    user_id: uuid.UUID,
    current_user: User = Depends(require_role("super_admin")),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Soft-delete (deactivate) a user (super_admin only)."""
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot deactivate your own account",
        )

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.is_active = False
    await db.flush()


# ──────────────────────────────────────────────────────────────────────────────
# Reset password (admin)
# ──────────────────────────────────────────────────────────────────────────────


@router.post("/{user_id}/reset-password", status_code=status.HTTP_204_NO_CONTENT)
async def reset_password(
    user_id: uuid.UUID,
    body: PasswordReset,
    current_user: User = Depends(require_role("super_admin")),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Reset another user's password (super_admin only)."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.hashed_password = get_password_hash(body.new_password)
    await db.flush()


# ──────────────────────────────────────────────────────────────────────────────
# Change own password
# ──────────────────────────────────────────────────────────────────────────────


@router.post("/me/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_own_password(
    body: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Authenticated user changes their own password."""
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    current_user.hashed_password = get_password_hash(body.new_password)
    await db.flush()
