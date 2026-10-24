from pathlib import Path
from typing import Optional
from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Directory anchors
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # backend/
ROOT_DIR = BASE_DIR.parent                               # workspace root (dailydose/)


class Settings(BaseSettings):
    """Application settings loaded from environment variables and .env files."""

    model_config = SettingsConfigDict(
        env_file=(
            str(ROOT_DIR / ".env"),
            str(BASE_DIR / ".env"),
        ),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # General Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PROJECT_NAME: str = "DailyDose AI API"
    VERSION: str = "0.1.0"

    # PostgreSQL Configuration
    POSTGRES_HOST: str = "127.0.0.1"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "dailydose_app"
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = "dailydose_db"

    # Database connection pool settings
    DB_ECHO: bool = False
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10

    # Optional direct DATABASE_URL override
    DATABASE_URL: Optional[str] = None

    # LLM API Keys (Google Gemini & Groq Free Tier, OpenAI)
    GEMINI_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None

    @computed_field
    @property
    def async_database_url(self) -> str:
        """Asynchronous database connection URL for SQLAlchemy 2.x with asyncpg."""
        if self.DATABASE_URL:
            url = self.DATABASE_URL
            if url.startswith("postgres://"):
                return url.replace("postgres://", "postgresql+asyncpg://", 1)
            if url.startswith("postgresql://"):
                return url.replace("postgresql://", "postgresql+asyncpg://", 1)
            return url
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @computed_field
    @property
    def sync_database_url(self) -> str:
        """Synchronous database connection URL for migrations (Alembic) with psycopg2."""
        if self.DATABASE_URL:
            url = self.DATABASE_URL
            if url.startswith("postgres://"):
                return url.replace("postgres://", "postgresql+psycopg2://", 1)
            if url.startswith("postgresql+asyncpg://"):
                return url.replace("postgresql+asyncpg://", "postgresql+psycopg2://", 1)
            if url.startswith("postgresql://"):
                return url.replace("postgresql://", "postgresql+psycopg2://", 1)
            return url
        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )


settings = Settings()
