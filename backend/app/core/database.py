import re
from typing import AsyncGenerator
from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


class Base(DeclarativeBase):
    """SQLAlchemy 2.x Declarative Base for models."""
    pass


# Asynchronous SQLAlchemy Engine
engine: AsyncEngine = create_async_engine(
    settings.async_database_url,
    echo=settings.DB_ECHO,
    pool_pre_ping=True,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
)

# Asynchronous session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency to yield an async database session per request."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def check_database_connection() -> dict:
    """Utility to test the database connection and return detailed status safely."""
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(text("SELECT 1"))
            scalar = result.scalar()
            if scalar == 1:
                return {
                    "connected": True,
                    "host": settings.POSTGRES_HOST,
                    "port": settings.POSTGRES_PORT,
                    "database": settings.POSTGRES_DB,
                    "user": settings.POSTGRES_USER,
                    "message": "Koneksi ke PostgreSQL berhasil diverifikasi secara nyata.",
                }
            return {
                "connected": False,
                "message": f"Unexpected response from database: {scalar}",
            }
    except Exception as exc:
        err_str = str(exc)
        # Mask any connection URL credentials
        err_str = re.sub(r"://([^:@\s]+):([^@\s]+)@", r"://\1:***@", err_str)
        if settings.POSTGRES_PASSWORD and settings.POSTGRES_PASSWORD.strip():
            err_str = err_str.replace(settings.POSTGRES_PASSWORD, "***")
        return {
            "connected": False,
            "host": settings.POSTGRES_HOST,
            "port": settings.POSTGRES_PORT,
            "database": settings.POSTGRES_DB,
            "user": settings.POSTGRES_USER,
            "error_type": exc.__class__.__name__,
            "error": err_str,
            "message": "Gagal terhubung ke PostgreSQL. Pastikan service berjalan dan password di .env valid.",
        }
