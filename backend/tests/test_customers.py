"""Tests for Customer API endpoints."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import get_db


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

def _make_mock_customer(**overrides):
    """Create a mock Customer ORM object."""
    from datetime import datetime, timezone
    defaults = {
        "id": 1,
        "name": "Test Customer",
        "email": "test@example.com",
        "phone": "08123456789",
        "address": "Jl. Test No. 1",
        "is_active": True,
        "created_at": datetime(2026, 1, 1, tzinfo=timezone.utc),
        "updated_at": datetime(2026, 1, 1, tzinfo=timezone.utc),
    }
    defaults.update(overrides)
    mock = MagicMock()
    for k, v in defaults.items():
        setattr(mock, k, v)
    return mock


@pytest.fixture
def client():
    """TestClient with overridden DB dependency."""
    mock_session = AsyncMock()
    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c, mock_session
    app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# Tests: List customers
# ---------------------------------------------------------------------------

class TestListCustomers:
    @patch("app.api.routes.customers.customer_service")
    def test_list_customers_empty(self, mock_service, client):
        c, _ = client
        mock_service.list_customers = AsyncMock(return_value=([], 0))
        response = c.get("/customers")
        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["total"] == 0
        assert data["has_more"] is False

    @patch("app.api.routes.customers.customer_service")
    def test_list_customers_with_results(self, mock_service, client):
        c, _ = client
        customer = _make_mock_customer()
        mock_service.list_customers = AsyncMock(return_value=([customer], 1))
        response = c.get("/customers")
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 1
        assert data["items"][0]["name"] == "Test Customer"

    @patch("app.api.routes.customers.customer_service")
    def test_list_customers_pagination(self, mock_service, client):
        c, _ = client
        mock_service.list_customers = AsyncMock(return_value=([], 50))
        response = c.get("/customers?offset=0&limit=10")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 50
        assert data["has_more"] is True


# ---------------------------------------------------------------------------
# Tests: Get single customer
# ---------------------------------------------------------------------------

class TestGetCustomer:
    @patch("app.api.routes.customers.customer_service")
    def test_get_customer_found(self, mock_service, client):
        c, _ = client
        customer = _make_mock_customer()
        mock_service.get_customer = AsyncMock(return_value=customer)
        response = c.get("/customers/1")
        assert response.status_code == 200
        assert response.json()["id"] == 1

    @patch("app.api.routes.customers.customer_service")
    def test_get_customer_not_found(self, mock_service, client):
        c, _ = client
        mock_service.get_customer = AsyncMock(return_value=None)
        response = c.get("/customers/999")
        assert response.status_code == 404


# ---------------------------------------------------------------------------
# Tests: Create customer
# ---------------------------------------------------------------------------

class TestCreateCustomer:
    @patch("app.api.routes.customers.customer_service")
    def test_create_customer_success(self, mock_service, client):
        c, _ = client
        customer = _make_mock_customer()
        mock_service.get_customer_by_email = AsyncMock(return_value=None)
        mock_service.create_customer = AsyncMock(return_value=customer)
        response = c.post("/customers", json={"name": "Test Customer", "email": "test@example.com"})
        assert response.status_code == 201
        assert response.json()["name"] == "Test Customer"

    @patch("app.api.routes.customers.customer_service")
    def test_create_customer_duplicate_email(self, mock_service, client):
        c, _ = client
        existing = _make_mock_customer()
        mock_service.get_customer_by_email = AsyncMock(return_value=existing)
        response = c.post("/customers", json={"name": "Another", "email": "test@example.com"})
        assert response.status_code == 409

    def test_create_customer_missing_name(self, client):
        c, _ = client
        response = c.post("/customers", json={"email": "test@example.com"})
        assert response.status_code == 422


# ---------------------------------------------------------------------------
# Tests: Update customer
# ---------------------------------------------------------------------------

class TestUpdateCustomer:
    @patch("app.api.routes.customers.customer_service")
    def test_update_customer_success(self, mock_service, client):
        c, _ = client
        customer = _make_mock_customer()
        updated = _make_mock_customer(name="Updated Name")
        mock_service.get_customer = AsyncMock(return_value=customer)
        mock_service.update_customer = AsyncMock(return_value=updated)
        response = c.patch("/customers/1", json={"name": "Updated Name"})
        assert response.status_code == 200
        assert response.json()["name"] == "Updated Name"

    @patch("app.api.routes.customers.customer_service")
    def test_update_customer_not_found(self, mock_service, client):
        c, _ = client
        mock_service.get_customer = AsyncMock(return_value=None)
        response = c.patch("/customers/999", json={"name": "Nope"})
        assert response.status_code == 404


# ---------------------------------------------------------------------------
# Tests: Delete customer
# ---------------------------------------------------------------------------

class TestDeleteCustomer:
    @patch("app.api.routes.customers.customer_service")
    def test_delete_customer_success(self, mock_service, client):
        c, _ = client
        customer = _make_mock_customer()
        mock_service.get_customer = AsyncMock(return_value=customer)
        mock_service.delete_customer = AsyncMock(return_value=None)
        response = c.delete("/customers/1")
        assert response.status_code == 200
        assert "berhasil dihapus" in response.json()["message"]

    @patch("app.api.routes.customers.customer_service")
    def test_delete_customer_not_found(self, mock_service, client):
        c, _ = client
        mock_service.get_customer = AsyncMock(return_value=None)
        response = c.delete("/customers/999")
        assert response.status_code == 404
