"""Pydantic schemas for Task entity."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str = Field(..., min_length=1, max_length=255, description="Judul task")
    description: Optional[str] = Field(default=None, description="Deskripsi task")
    status: str = Field(default="PENDING", description="Status: PENDING, IN_PROGRESS, COMPLETED, CANCELLED")
    priority: str = Field(default="MEDIUM", description="Prioritas: LOW, MEDIUM, HIGH, URGENT")
    due_date: Optional[datetime] = Field(default=None, description="Batas waktu")
    customer_id: Optional[int] = Field(default=None, description="ID pelanggan terkait (opsional)")


class TaskUpdate(BaseModel):
    """Schema for updating an existing task. All fields optional."""

    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
    status: Optional[str] = Field(default=None)
    priority: Optional[str] = Field(default=None)
    due_date: Optional[datetime] = Field(default=None)
    customer_id: Optional[int] = Field(default=None)


class TaskResponse(BaseModel):
    """Schema for task response (read)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    due_date: Optional[datetime] = None
    customer_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
