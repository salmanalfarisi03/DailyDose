from unittest.mock import AsyncMock
from app.main import app
from app.core.database import get_db


def test_root_endpoint(client):
    """Test root GET / endpoint returns 200 with service info."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"
    assert data["health"] == "/health"


def test_health_endpoint_success(client, mock_db_session_success):
    """Test GET /health when database connection succeeds (HTTP 200)."""
    app.dependency_overrides[get_db] = lambda: mock_db_session_success
    try:
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()

        # Differentiates application status and database status
        assert data["app_status"] == "ok"
        assert data["database_status"] == "connected"
        assert data["status"] == "healthy"

        # Database health details
        db_info = data["database"]
        assert db_info["connected"] is True
        assert db_info["status"] == "connected"
        assert db_info["host"] == "127.0.0.1"
        assert db_info["port"] == 5432
        assert db_info["database"] == "dailydose_db"
        assert db_info["user"] == "dailydose_app"
        assert data["error"] is None
    finally:
        app.dependency_overrides.clear()


def test_health_endpoint_failure(client, mock_db_session_failure):
    """Test GET /health when database connection fails (HTTP 503)."""
    app.dependency_overrides[get_db] = lambda: mock_db_session_failure
    try:
        response = client.get("/health")
        assert response.status_code == 503
        data = response.json()

        # Application is running even if database is down
        assert data["app_status"] == "ok"
        assert data["database_status"] == "disconnected"
        assert data["status"] == "degraded"

        # Database details show disconnected state
        db_info = data["database"]
        assert db_info["connected"] is False
        assert db_info["status"] == "disconnected"
        assert db_info["host"] == "127.0.0.1"
        assert db_info["port"] == 5432
        assert db_info["database"] == "dailydose_db"
        assert db_info["user"] == "dailydose_app"
        assert "error" in data
    finally:
        app.dependency_overrides.clear()


def test_health_endpoint_credential_leak_prevention(client):
    """Test that database error messages sanitize connection URLs and never leak passwords."""
    mock_session = AsyncMock()
    mock_session.execute.side_effect = Exception(
        "Connection refused: postgresql+asyncpg://dailydose_app:super_secret_pw@127.0.0.1:5432/dailydose_db"
    )
    app.dependency_overrides[get_db] = lambda: mock_session
    try:
        response = client.get("/health")
        assert response.status_code == 503
        content = response.text

        # Verify password is NOT leaked in the response body
        assert "super_secret_pw" not in content
        # Verify sanitized mask is present
        assert "***" in content
    finally:
        app.dependency_overrides.clear()
