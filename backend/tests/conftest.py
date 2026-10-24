from unittest.mock import AsyncMock, MagicMock
import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """FastAPI TestClient fixture for synchronous and robust endpoint testing."""
    with TestClient(app, raise_server_exceptions=False) as test_client:
        yield test_client


@pytest.fixture
def mock_db_session_success():
    """Mock an AsyncSession that successfully returns 1 for SELECT 1."""
    session = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalar.return_value = 1
    session.execute.return_value = mock_result
    return session


@pytest.fixture
def mock_db_session_failure():
    """Mock an AsyncSession that simulates connection failure to PostgreSQL."""
    session = AsyncMock()
    session.execute.side_effect = ConnectionRefusedError(
        "Could not connect to PostgreSQL server at 127.0.0.1:5432"
    )
    return session
