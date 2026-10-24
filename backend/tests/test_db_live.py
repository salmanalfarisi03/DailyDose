"""Diagnostic script to test live PostgreSQL connection using current settings."""
import asyncio
from app.core.config import settings
from app.core.database import check_database_connection


async def main():
    print("=" * 60)
    print("DailyDose AI - Live PostgreSQL Connection Test")
    print("=" * 60)
    print(f"Target Host    : {settings.POSTGRES_HOST}")
    print(f"Target Port    : {settings.POSTGRES_PORT}")
    print(f"Target Database: {settings.POSTGRES_DB}")
    print(f"Target User    : {settings.POSTGRES_USER}")
    masked_pw = "*" * len(settings.POSTGRES_PASSWORD) if settings.POSTGRES_PASSWORD else "(kosong/belum diisi)"
    print(f"Password Status: {masked_pw}")
    print("-" * 60)
    print("Mencoba koneksi ke PostgreSQL via SQLAlchemy (asyncpg)...")

    result = await check_database_connection()

    if result.get("connected"):
        print("[SUCCESS] Koneksi ke PostgreSQL BERHASIL!")
        print(f"Pesan: {result.get('message')}")
    else:
        print("[FAILED] Koneksi ke PostgreSQL GAGAL.")
        print(f"Tipe Error: {result.get('error_type')}")
        print(f"Detail    : {result.get('error')}")
        print(f"Petunjuk  : {result.get('message')}")
    print("=" * 60)
    return result


if __name__ == "__main__":
    asyncio.run(main())
