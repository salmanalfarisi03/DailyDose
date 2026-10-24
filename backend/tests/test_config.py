import pytest
from app.core.config import Settings


def test_settings_default_values():
    """Verify that default settings match project requirements."""
    settings = Settings()
    assert settings.POSTGRES_HOST == "127.0.0.1"
    assert settings.POSTGRES_PORT == 5432
    assert settings.POSTGRES_USER == "dailydose_app"
    assert settings.POSTGRES_DB == "dailydose_db"
    assert settings.PROJECT_NAME == "DailyDose AI API"


def test_settings_url_generation():
    """Verify async and sync SQLAlchemy database connection URLs."""
    custom = Settings(
        POSTGRES_HOST="127.0.0.1",
        POSTGRES_PORT=5432,
        POSTGRES_USER="test_user",
        POSTGRES_PASSWORD="secret_password",
        POSTGRES_DB="test_db",
    )
    assert custom.async_database_url == "postgresql+asyncpg://test_user:secret_password@127.0.0.1:5432/test_db"
    assert custom.sync_database_url == "postgresql+psycopg2://test_user:secret_password@127.0.0.1:5432/test_db"


def test_settings_direct_database_url_override():
    """Verify DATABASE_URL override behavior."""
    custom = Settings(DATABASE_URL="postgresql://user:pass@localhost:5432/custom_db")
    assert custom.async_database_url == "postgresql+asyncpg://user:pass@localhost:5432/custom_db"
    assert custom.sync_database_url == "postgresql+psycopg2://user:pass@localhost:5432/custom_db"
