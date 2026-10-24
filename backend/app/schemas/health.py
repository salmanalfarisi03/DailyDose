from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class DatabaseHealth(BaseModel):
    """Schema for database health details."""

    status: str = Field(..., description="Status konektivitas database ('connected' / 'disconnected')")
    connected: bool = Field(..., description="Boolean indikator koneksi aktif")
    host: str = Field(..., description="Host PostgreSQL")
    port: int = Field(..., description="Port PostgreSQL")
    database: str = Field(..., description="Nama database")
    user: str = Field(..., description="User database")
    error_type: Optional[str] = Field(default=None, description="Tipe error jika gagal (tanpa kredensial)")
    message: str = Field(..., description="Pesan deskriptif status koneksi")


class HealthResponse(BaseModel):
    """Schema for health check endpoint response distinguishing app and database status."""

    app_status: str = Field(..., description="Status aplikasi FastAPI ('ok' / 'running')")
    database_status: str = Field(..., description="Status konektivitas database ('connected' / 'disconnected')")
    status: str = Field(..., description="Status agregat sistem ('healthy' jika semua komponen siap, 'degraded' jika database gagal)")
    environment: str = Field(..., description="Lingkungan aplikasi (development / production)")
    version: str = Field(..., description="Versi aplikasi")
    database: DatabaseHealth = Field(..., description="Detail kesehatan database")
    error: Optional[str] = Field(default=None, description="Pesan ringkas error jika database tidak terhubung (tersanitasi)")
