"""Tests for Product API endpoints."""

import pytest
from decimal import Decimal
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import get_db


def _make_mock_product(**overrides):
    """Create a mock Product ORM object."""
    from datetime import datetime, timezone
    defaults = {
        "id": 1,
        "sku": "SKU-001",
        "name": "Test Product",
        "description": "A test product",
        "price": Decimal("99000.00"),
        "stock": 100,
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
    mock_session = AsyncMock()
    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c, mock_session
    app.dependency_overrides.clear()


class TestListProducts:
    @patch("app.api.routes.products.product_service")
    def test_list_products_empty(self, mock_service, client):
        c, _ = client
        mock_service.list_products = AsyncMock(return_value=([], 0))
        response = c.get("/products")
        assert response.status_code == 200
        assert response.json()["items"] == []

    @patch("app.api.routes.products.product_service")
    def test_list_products_with_data(self, mock_service, client):
        c, _ = client
        product = _make_mock_product()
        mock_service.list_products = AsyncMock(return_value=([product], 1))
        response = c.get("/products")
        assert response.status_code == 200
        assert len(response.json()["items"]) == 1


class TestGetProduct:
    @patch("app.api.routes.products.product_service")
    def test_get_product_found(self, mock_service, client):
        c, _ = client
        mock_service.get_product = AsyncMock(return_value=_make_mock_product())
        response = c.get("/products/1")
        assert response.status_code == 200
        assert response.json()["sku"] == "SKU-001"

    @patch("app.api.routes.products.product_service")
    def test_get_product_not_found(self, mock_service, client):
        c, _ = client
        mock_service.get_product = AsyncMock(return_value=None)
        response = c.get("/products/999")
        assert response.status_code == 404


class TestCreateProduct:
    @patch("app.api.routes.products.product_service")
    def test_create_product_success(self, mock_service, client):
        c, _ = client
        mock_service.get_product_by_sku = AsyncMock(return_value=None)
        mock_service.create_product = AsyncMock(return_value=_make_mock_product())
        response = c.post("/products", json={
            "name": "Test Product",
            "price": "99000.00",
            "sku": "SKU-001",
        })
        assert response.status_code == 201

    @patch("app.api.routes.products.product_service")
    def test_create_product_duplicate_sku(self, mock_service, client):
        c, _ = client
        mock_service.get_product_by_sku = AsyncMock(return_value=_make_mock_product())
        response = c.post("/products", json={
            "name": "Another Product",
            "price": "50000.00",
            "sku": "SKU-001",
        })
        assert response.status_code == 409

    def test_create_product_negative_price(self, client):
        c, _ = client
        response = c.post("/products", json={
            "name": "Bad Product",
            "price": "-1.00",
        })
        assert response.status_code == 422


class TestUpdateProduct:
    @patch("app.api.routes.products.product_service")
    def test_update_product_success(self, mock_service, client):
        c, _ = client
        product = _make_mock_product()
        updated = _make_mock_product(name="Updated Product")
        mock_service.get_product = AsyncMock(return_value=product)
        mock_service.update_product = AsyncMock(return_value=updated)
        response = c.patch("/products/1", json={"name": "Updated Product"})
        assert response.status_code == 200
        assert response.json()["name"] == "Updated Product"

    @patch("app.api.routes.products.product_service")
    def test_update_product_not_found(self, mock_service, client):
        c, _ = client
        mock_service.get_product = AsyncMock(return_value=None)
        response = c.patch("/products/999", json={"name": "Nope"})
        assert response.status_code == 404


class TestDeleteProduct:
    @patch("app.api.routes.products.product_service")
    def test_delete_product_success(self, mock_service, client):
        c, _ = client
        mock_service.get_product = AsyncMock(return_value=_make_mock_product())
        mock_service.delete_product = AsyncMock(return_value=None)
        response = c.delete("/products/1")
        assert response.status_code == 200
        assert "berhasil dihapus" in response.json()["message"]

    @patch("app.api.routes.products.product_service")
    def test_delete_product_not_found(self, mock_service, client):
        c, _ = client
        mock_service.get_product = AsyncMock(return_value=None)
        response = c.delete("/products/999")
        assert response.status_code == 404
