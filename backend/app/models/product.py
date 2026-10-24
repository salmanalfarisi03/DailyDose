from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Boolean, CheckConstraint, DateTime, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.invoice_item import InvoiceItem


class Product(Base):
    """Katalog produk untuk DailyDose AI."""

    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("price >= 0", name="chk_products_price_non_negative"),
        CheckConstraint("stock >= 0", name="chk_products_stock_non_negative"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    sku: Mapped[Optional[str]] = mapped_column(String(100), unique=True, index=True, nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    stock: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relasi ke invoice_items (RESTRICT jika produk pernah digunakan pada invoice)
    invoice_items: Mapped[List["InvoiceItem"]] = relationship(
        "InvoiceItem",
        back_populates="product",
        passive_deletes="all",
    )

    def __repr__(self) -> str:
        return f"<Product(id={self.id}, sku='{self.sku}', name='{self.name}', price={self.price})>"
