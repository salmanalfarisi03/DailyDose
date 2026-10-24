import re
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.schemas.health import DatabaseHealth, HealthResponse

router = APIRouter(tags=["Health"])


def sanitize_db_error(error: Exception) -> str:
    """
    Sanitasi pesan error database agar tidak membocorkan kredensial atau password:
    1. Mask kredensial di dalam URL: postgresql://user:password@host -> postgresql://user:***@host
    2. Hapus password yang terkonfigurasi jika muncul dalam string pesan.
    """
    msg = str(error)
    # Mask format URI: protocol://user:password@host
    msg = re.sub(r"://([^:@\s]+):([^@\s]+)@", r"://\1:***@", msg)

    # Mask password dari settings jika ada dan tidak kosong
    if settings.POSTGRES_PASSWORD and settings.POSTGRES_PASSWORD.strip():
        msg = msg.replace(settings.POSTGRES_PASSWORD, "***")

    return msg


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Periksa status aplikasi dan koneksi database secara nyata",
)
async def health_check(response: Response, db: AsyncSession = Depends(get_db)):
    """
    Endpoint pemeriksaan kesehatan sistem:
    - Memverifikasi server aplikasi berjalan (app_status = 'ok').
    - Menguji koneksi database nyata dengan kueri `SELECT 1` (database_status = 'connected' / 'disconnected').
    - Membedakan status aplikasi dan database secara eksplisit.
    - Menangani kegagalan database dengan aman tanpa membocorkan kredensial (HTTP 503).
    """
    try:
        query_result = await db.execute(text("SELECT 1"))
        scalar = query_result.scalar()

        if scalar == 1:
            return HealthResponse(
                app_status="ok",
                database_status="connected",
                status="healthy",
                environment=settings.ENVIRONMENT,
                version=settings.VERSION,
                database=DatabaseHealth(
                    status="connected",
                    connected=True,
                    host=settings.POSTGRES_HOST,
                    port=settings.POSTGRES_PORT,
                    database=settings.POSTGRES_DB,
                    user=settings.POSTGRES_USER,
                    error_type=None,
                    message="Koneksi ke PostgreSQL berhasil diverifikasi secara nyata.",
                ),
                error=None,
            )
        else:
            response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
            return HealthResponse(
                app_status="ok",
                database_status="disconnected",
                status="degraded",
                environment=settings.ENVIRONMENT,
                version=settings.VERSION,
                database=DatabaseHealth(
                    status="disconnected",
                    connected=False,
                    host=settings.POSTGRES_HOST,
                    port=settings.POSTGRES_PORT,
                    database=settings.POSTGRES_DB,
                    user=settings.POSTGRES_USER,
                    error_type="UnexpectedQueryResult",
                    message=f"Hasil query tidak terduga: {scalar}",
                ),
                error="Invalid query scalar response",
            )
    except Exception as exc:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        sanitized_msg = sanitize_db_error(exc)
        return HealthResponse(
            app_status="ok",
            database_status="disconnected",
            status="degraded",
            environment=settings.ENVIRONMENT,
            version=settings.VERSION,
            database=DatabaseHealth(
                status="disconnected",
                connected=False,
                host=settings.POSTGRES_HOST,
                port=settings.POSTGRES_PORT,
                database=settings.POSTGRES_DB,
                user=settings.POSTGRES_USER,
                error_type=exc.__class__.__name__,
                message="Gagal terhubung ke database PostgreSQL. Pastikan service PostgreSQL berjalan dan password di file .env lokal valid.",
            ),
            error=sanitized_msg,
        )
