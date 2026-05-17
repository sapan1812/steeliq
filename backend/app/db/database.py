from __future__ import annotations

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

from app.core.config import get_settings

settings = get_settings()

# ──────────────────────────────────────────────────────────────────────────────
# Engine & session factory
# ──────────────────────────────────────────────────────────────────────────────

engine = create_async_engine(
    settings.database_url,
    echo=False,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()

# ──────────────────────────────────────────────────────────────────────────────
# FastAPI dependency
# ──────────────────────────────────────────────────────────────────────────────


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Yield an ``AsyncSession`` and ensure it is closed after the request."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# ──────────────────────────────────────────────────────────────────────────────
# Table initialisation (used on startup, not instead of Alembic migrations)
# ──────────────────────────────────────────────────────────────────────────────


async def init_db() -> None:
    """Create all tables that do not yet exist.

    In production the preferred path is ``alembic upgrade head``.  This
    function is kept as a fallback for container cold-starts where Alembic
    has already been run by the CMD script.
    """
    # Import all models so their metadata is registered on Base
    import app.models.user  # noqa: F401
    import app.models.module  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
