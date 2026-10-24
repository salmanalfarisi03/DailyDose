"""Pydantic schemas for Customer entity."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, ConfigDict


class CustomerCreate(BaseModel):
    """Schema for creating a new customer."""

    name: str = Field(..., min_length=1, max_length=255, description="Nama pelanggan")
    email: Optional[str] = Field(default=None, max_length=255, description="Email pelanggan (unik)")
    phone: Optional[str] = Field(default=None, max_length=50, description="Nomor telepon")
    address: Optional[str] = Field(default=None, description="Alamat pelanggan")
    is_active: bool = Field(default=True, description="Status aktif pelanggan")


class CustomerUpdate(BaseModel):
    """Schema for updating an existing customer. All fields optional."""

    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    email: Optional[str] = Field(default=None, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=50)
    address: Optional[str] = Field(default=None)
    is_active: Optional[bool] = Field(default=None)


class CustomerResponse(BaseModel):
    """Schema for customer response (read)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
