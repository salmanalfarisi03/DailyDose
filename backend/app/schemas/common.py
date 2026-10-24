"""Shared Pydantic schemas used across multiple API endpoints."""

from typing import Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class MessageResponse(BaseModel):
    """Simple message response for delete/action confirmations."""

    message: str = Field(..., description="Pesan deskriptif hasil operasi")
    detail: Optional[str] = Field(default=None, description="Detail tambahan")


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated list response."""

    items: List[T] = Field(..., description="Daftar item pada halaman ini")
    total: int = Field(..., description="Total jumlah record yang cocok")
    limit: int = Field(..., description="Jumlah item per halaman")
    offset: int = Field(..., description="Offset dari awal daftar")
    has_more: bool = Field(..., description="Apakah masih ada halaman berikutnya")
