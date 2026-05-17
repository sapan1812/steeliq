from __future__ import annotations

import hashlib
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ──────────────────────────────────────────────────────────────────────────────
# Password helpers
# ──────────────────────────────────────────────────────────────────────────────


def get_password_hash(password: str) -> str:
    """Return bcrypt hash of *password*."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Return True if *plain_password* matches *hashed_password*."""
    return pwd_context.verify(plain_password, hashed_password)


# ──────────────────────────────────────────────────────────────────────────────
# Token helpers
# ──────────────────────────────────────────────────────────────────────────────

_ACCESS_TYPE = "access"
_REFRESH_TYPE = "refresh"


def _utcnow() -> datetime:
    return datetime.now(tz=timezone.utc)


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Create a signed JWT access token."""
    to_encode = data.copy()
    expire = _utcnow() + (
        expires_delta
        if expires_delta is not None
        else timedelta(minutes=settings.access_token_expire_minutes)
    )
    to_encode.update({"exp": expire, "type": _ACCESS_TYPE})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def create_refresh_token(data: Dict[str, Any]) -> str:
    """Create a signed JWT refresh token with longer expiry."""
    to_encode = data.copy()
    expire = _utcnow() + timedelta(days=settings.refresh_token_expire_days)
    to_encode.update({"exp": expire, "type": _REFRESH_TYPE})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def verify_token(token: str, expected_type: str = _ACCESS_TYPE) -> Dict[str, Any]:
    """
    Decode and validate *token*.

    Raises ``JWTError`` on any failure (expired, bad signature, wrong type).
    Returns the raw payload dict on success.
    """
    payload: Dict[str, Any] = jwt.decode(
        token, settings.secret_key, algorithms=[settings.algorithm]
    )
    if payload.get("type") != expected_type:
        raise JWTError(f"Token type mismatch: expected '{expected_type}'")
    return payload


def hash_token(token: str) -> str:
    """SHA-256 fingerprint stored in DB instead of the raw refresh token."""
    return hashlib.sha256(token.encode()).hexdigest()
