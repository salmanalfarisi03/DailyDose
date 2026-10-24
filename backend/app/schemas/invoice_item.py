"""Pydantic schemas for InvoiceItem entity."""

from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class InvoiceItemCreate(BaseModel):
    """Schema for creating an invoice line item."""

    product_id: Optional[int] = Field(default=None, description="ID produk (opsional)")
    description: str = Field(..., min_length=1, max_length=255, description="Deskripsi item")
    quantity: int = Field(..., gt=0, description="Kuantitas (harus > 0)")
    unit_price: Decimal = Field(..., ge=0, decimal_places=2, description="Harga satuan")


class InvoiceItemUpdate(BaseModel):
    """Schema for updating an invoice line item."""

    product_id: Optional[int] = Field(default=None)
    description: Optional[str] = Field(default=None, min_length=1, max_length=255)
    quantity: Optional[int] = Field(default=None, gt=0)
    unit_price: Optional[Decimal] = Field(default=None, ge=0, decimal_places=2)


class InvoiceItemResponse(BaseModel):
    """Schema for invoice item response (read)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    invoice_id: int
    product_id: Optional[int] = None
    description: str
    quantity: int
    unit_price: Decimal
    total_price: Decimal
    created_at: datetime
