"""Pydantic schemas for Invoice entity."""

from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

from app.schemas.invoice_item import InvoiceItemCreate, InvoiceItemResponse


class InvoiceCreate(BaseModel):
    """Schema for creating a new invoice with optional line items."""

    invoice_number: str = Field(..., min_length=1, max_length=50, description="Nomor invoice (unik)")
    customer_id: int = Field(..., description="ID pelanggan")
    issue_date: date = Field(default_factory=date.today, description="Tanggal terbit")
    due_date: Optional[date] = Field(default=None, description="Tanggal jatuh tempo")
    status: str = Field(default="DRAFT", description="Status invoice")
    notes: Optional[str] = Field(default=None, description="Catatan")
    items: List[InvoiceItemCreate] = Field(default_factory=list, description="Daftar item invoice")


class InvoiceUpdate(BaseModel):
    """Schema for updating an existing invoice. All fields optional."""

    invoice_number: Optional[str] = Field(default=None, min_length=1, max_length=50)
    customer_id: Optional[int] = Field(default=None)
    issue_date: Optional[date] = Field(default=None)
    due_date: Optional[date] = Field(default=None)
    status: Optional[str] = Field(default=None)
    notes: Optional[str] = Field(default=None)


class InvoiceStatusUpdate(BaseModel):
    """Schema for updating invoice status only."""

    status: str = Field(..., description="Status baru: DRAFT, ISSUED, PAID, CANCELLED, OVERDUE")


class InvoiceResponse(BaseModel):
    """Schema for invoice response (read) with nested items."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    invoice_number: str
    customer_id: int
    issue_date: date
    due_date: Optional[date] = None
    status: str
    subtotal: Decimal
    tax_amount: Decimal
    discount_amount: Decimal
    total_amount: Decimal
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[InvoiceItemResponse] = Field(default_factory=list)
