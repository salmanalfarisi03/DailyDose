"""Tests for Invoice API endpoints."""

import pytest
from datetime import date, datetime, timezone
from decimal import Decimal
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import get_db


def _make_mock_item(**overrides):
    defaults = {
        "id": 1,
        "invoice_id": 1,
        "product_id": None,
        "description": "Item A",
        "quantity": 2,
        "unit_price": Decimal("50000.00"),
        "total_price": Decimal("100000.00"),
        "created_at": datetime(2026, 1, 1, tzinfo=timezone.utc),
    }
    defaults.update(overrides)
    mock = MagicMock()
    for k, v in defaults.items():
        setattr(mock, k, v)
    return mock


def _make_mock_invoice(**overrides):
    defaults = {
        "id": 1,
        "invoice_number": "INV-001",
        "customer_id": 1,
        "issue_date": date(2026, 1, 1),
        "due_date": date(2026, 2, 1),
        "status": "DRAFT",
        "subtotal": Decimal("100000.00"),
        "tax_amount": Decimal("0.00"),
        "discount_amount": Decimal("0.00"),
        "total_amount": Decimal("100000.00"),
        "notes": None,
        "created_at": datetime(2026, 1, 1, tzinfo=timezone.utc),
        "updated_at": datetime(2026, 1, 1, tzinfo=timezone.utc),
        "items": [_make_mock_item()],
    }
    defaults.update(overrides)
    mock = MagicMock()
    for k, v in defaults.items():
        setattr(mock, k, v)
    return mock


def _make_mock_customer(**overrides):
    from datetime import datetime, timezone
    defaults = {
        "id": 1, "name": "Cust", "email": "c@e.com", "phone": None,
        "address": None, "is_active": True,
        "created_at": datetime(2026, 1, 1, tzinfo=timezone.utc),
        "updated_at": datetime(2026, 1, 1, tzinfo=timezone.utc),
    }
    defaults.update(overrides)
    m = MagicMock()
    for k, v in defaults.items():
        setattr(m, k, v)
    return m


@pytest.fixture
def client():
    mock_session = AsyncMock()
    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c, mock_session
    app.dependency_overrides.clear()


class TestListInvoices:
    @patch("app.api.routes.invoices.invoice_service")
    def test_list_invoices_empty(self, mock_service, client):
        c, _ = client
        mock_service.list_invoices = AsyncMock(return_value=([], 0))
        response = c.get("/invoices")
        assert response.status_code == 200
        assert response.json()["total"] == 0

    @patch("app.api.routes.invoices.invoice_service")
    def test_list_invoices_with_filter(self, mock_service, client):
        c, _ = client
        invoice = _make_mock_invoice()
        mock_service.list_invoices = AsyncMock(return_value=([invoice], 1))
        response = c.get("/invoices?status=DRAFT")
        assert response.status_code == 200
        assert len(response.json()["items"]) == 1


class TestGetInvoice:
    @patch("app.api.routes.invoices.invoice_service")
    def test_get_invoice_found(self, mock_service, client):
        c, _ = client
        mock_service.get_invoice = AsyncMock(return_value=_make_mock_invoice())
        response = c.get("/invoices/1")
        assert response.status_code == 200
        data = response.json()
        assert data["invoice_number"] == "INV-001"
        assert len(data["items"]) == 1

    @patch("app.api.routes.invoices.invoice_service")
    def test_get_invoice_not_found(self, mock_service, client):
        c, _ = client
        mock_service.get_invoice = AsyncMock(return_value=None)
        response = c.get("/invoices/999")
        assert response.status_code == 404


class TestCreateInvoice:
    @patch("app.api.routes.invoices.invoice_service")
    @patch("app.api.routes.invoices.customer_service")
    def test_create_invoice_success(self, mock_cust_svc, mock_inv_svc, client):
        c, _ = client
        mock_cust_svc.get_customer = AsyncMock(return_value=_make_mock_customer())
        mock_inv_svc.get_invoice_by_number = AsyncMock(return_value=None)
        mock_inv_svc.create_invoice = AsyncMock(return_value=_make_mock_invoice())
        response = c.post("/invoices", json={
            "invoice_number": "INV-001",
            "customer_id": 1,
            "items": [
                {"description": "Item A", "quantity": 2, "unit_price": "50000.00"}
            ],
        })
        assert response.status_code == 201

    @patch("app.api.routes.invoices.customer_service")
    def test_create_invoice_customer_not_found(self, mock_cust_svc, client):
        c, _ = client
        mock_cust_svc.get_customer = AsyncMock(return_value=None)
        response = c.post("/invoices", json={
            "invoice_number": "INV-002",
            "customer_id": 999,
        })
        assert response.status_code == 404

    @patch("app.api.routes.invoices.invoice_service")
    @patch("app.api.routes.invoices.customer_service")
    def test_create_invoice_duplicate_number(self, mock_cust_svc, mock_inv_svc, client):
        c, _ = client
        mock_cust_svc.get_customer = AsyncMock(return_value=_make_mock_customer())
        mock_inv_svc.get_invoice_by_number = AsyncMock(return_value=_make_mock_invoice())
        response = c.post("/invoices", json={
            "invoice_number": "INV-001",
            "customer_id": 1,
        })
        assert response.status_code == 409


class TestUpdateInvoiceStatus:
    @patch("app.api.routes.invoices.invoice_service")
    def test_update_status_success(self, mock_service, client):
        c, _ = client
        updated = _make_mock_invoice(status="ISSUED")
        mock_service.get_invoice = AsyncMock(return_value=_make_mock_invoice())
        mock_service.update_invoice_status = AsyncMock(return_value=updated)
        response = c.patch("/invoices/1/status", json={"status": "ISSUED"})
        assert response.status_code == 200
        assert response.json()["status"] == "ISSUED"

    @patch("app.api.routes.invoices.invoice_service")
    def test_update_status_not_found(self, mock_service, client):
        c, _ = client
        mock_service.get_invoice = AsyncMock(return_value=None)
        response = c.patch("/invoices/999/status", json={"status": "PAID"})
        assert response.status_code == 404


class TestDeleteInvoice:
    @patch("app.api.routes.invoices.invoice_service")
    def test_delete_invoice_success(self, mock_service, client):
        c, _ = client
        mock_service.get_invoice = AsyncMock(return_value=_make_mock_invoice())
        mock_service.delete_invoice = AsyncMock(return_value=None)
        response = c.delete("/invoices/1")
        assert response.status_code == 200
        assert "berhasil dihapus" in response.json()["message"]

    @patch("app.api.routes.invoices.invoice_service")
    def test_delete_invoice_not_found(self, mock_service, client):
        c, _ = client
        mock_service.get_invoice = AsyncMock(return_value=None)
        response = c.delete("/invoices/999")
        assert response.status_code == 404
