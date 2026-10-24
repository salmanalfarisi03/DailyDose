"""Tests for Task API endpoints."""

import pytest
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import get_db


def _make_mock_task(**overrides):
    defaults = {
        "id": 1,
        "title": "Follow up client",
        "description": "Follow up with client about proposal",
        "status": "PENDING",
        "priority": "MEDIUM",
        "due_date": datetime(2026, 2, 1, tzinfo=timezone.utc),
        "customer_id": 1,
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


class TestListTasks:
    @patch("app.api.routes.tasks.task_service")
    def test_list_tasks_empty(self, mock_service, client):
        c, _ = client
        mock_service.list_tasks = AsyncMock(return_value=([], 0))
        response = c.get("/tasks")
        assert response.status_code == 200
        assert response.json()["items"] == []

    @patch("app.api.routes.tasks.task_service")
    def test_list_tasks_with_filters(self, mock_service, client):
        c, _ = client
        task = _make_mock_task()
        mock_service.list_tasks = AsyncMock(return_value=([task], 1))
        response = c.get("/tasks?status=PENDING&priority=MEDIUM")
        assert response.status_code == 200
        assert len(response.json()["items"]) == 1


class TestGetTask:
    @patch("app.api.routes.tasks.task_service")
    def test_get_task_found(self, mock_service, client):
        c, _ = client
        mock_service.get_task = AsyncMock(return_value=_make_mock_task())
        response = c.get("/tasks/1")
        assert response.status_code == 200
        assert response.json()["title"] == "Follow up client"

    @patch("app.api.routes.tasks.task_service")
    def test_get_task_not_found(self, mock_service, client):
        c, _ = client
        mock_service.get_task = AsyncMock(return_value=None)
        response = c.get("/tasks/999")
        assert response.status_code == 404


class TestCreateTask:
    @patch("app.api.routes.tasks.task_service")
    def test_create_task_success(self, mock_service, client):
        c, _ = client
        mock_service.create_task = AsyncMock(return_value=_make_mock_task())
        response = c.post("/tasks", json={"title": "Follow up client"})
        assert response.status_code == 201
        assert response.json()["status"] == "PENDING"

    def test_create_task_missing_title(self, client):
        c, _ = client
        response = c.post("/tasks", json={"priority": "HIGH"})
        assert response.status_code == 422

    @patch("app.api.routes.tasks.task_service")
    def test_create_task_invalid_status(self, mock_service, client):
        c, _ = client
        mock_service.create_task = AsyncMock(
            side_effect=ValueError("Status tidak valid: INVALID")
        )
        response = c.post("/tasks", json={"title": "Bad Task", "status": "INVALID"})
        assert response.status_code == 422


class TestUpdateTask:
    @patch("app.api.routes.tasks.task_service")
    def test_update_task_success(self, mock_service, client):
        c, _ = client
        task = _make_mock_task()
        updated = _make_mock_task(status="COMPLETED")
        mock_service.get_task = AsyncMock(return_value=task)
        mock_service.update_task = AsyncMock(return_value=updated)
        response = c.patch("/tasks/1", json={"status": "COMPLETED"})
        assert response.status_code == 200
        assert response.json()["status"] == "COMPLETED"

    @patch("app.api.routes.tasks.task_service")
    def test_update_task_not_found(self, mock_service, client):
        c, _ = client
        mock_service.get_task = AsyncMock(return_value=None)
        response = c.patch("/tasks/999", json={"title": "Nope"})
        assert response.status_code == 404


class TestDeleteTask:
    @patch("app.api.routes.tasks.task_service")
    def test_delete_task_success(self, mock_service, client):
        c, _ = client
        mock_service.get_task = AsyncMock(return_value=_make_mock_task())
        mock_service.delete_task = AsyncMock(return_value=None)
        response = c.delete("/tasks/1")
        assert response.status_code == 200
        assert "berhasil dihapus" in response.json()["message"]

    @patch("app.api.routes.tasks.task_service")
    def test_delete_task_not_found(self, mock_service, client):
        c, _ = client
        mock_service.get_task = AsyncMock(return_value=None)
        response = c.delete("/tasks/999")
        assert response.status_code == 404
