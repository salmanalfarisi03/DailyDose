"""Pydantic schemas for Product entity."""

from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class ProductCreate(BaseModel):
    """Schema for creating a new product."""

    sku: Optional[str] = Field(default=None, max_length=100, description="SKU produk (unik)")
    name: str = Field(..., min_length=1, max_length=255, description="Nama produk")
    description: Optional[str] = Field(default=None, description="Deskripsi produk")
    price: Decimal = Field(..., ge=0, decimal_places=2, description="Harga produk (non-negatif)")
    stock: int = Field(default=0, ge=0, description="Stok produk (non-negatif)")
    is_active: bool = Field(default=True, description="Status aktif produk")


class ProductUpdate(BaseModel):
    """Schema for updating an existing product. All fields optional."""

    sku: Optional[str] = Field(default=None, max_length=100)
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
    price: Optional[Decimal] = Field(default=None, ge=0, decimal_places=2)
    stock: Optional[int] = Field(default=None, ge=0)
    is_active: Optional[bool] = Field(default=None)


class ProductResponse(BaseModel):
    """Schema for product response (read)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    sku: Optional[str] = None
    name: str
    description: Optional[str] = None
    price: Decimal
    stock: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
