from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, Optional
from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.invoice import Invoice
    from app.models.product import Product


class InvoiceItem(Base):
    """Detail produk dan kuantitas pada setiap tagihan (Invoice)."""

    __tablename__ = "invoice_items"
    __table_args__ = (
        CheckConstraint("quantity > 0", name="chk_invoice_items_quantity_positive"),
        CheckConstraint("unit_price >= 0", name="chk_invoice_items_unit_price_non_negative"),
        CheckConstraint("total_price >= 0", name="chk_invoice_items_total_price_non_negative"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    invoice_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("invoices.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    product_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("products.id", ondelete="RESTRICT"),
        nullable=True,
        index=True,
    )
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    total_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relasi
    invoice: Mapped["Invoice"] = relationship("Invoice", back_populates="items")
    product: Mapped[Optional["Product"]] = relationship("Product", back_populates="invoice_items")

    def __repr__(self) -> str:
        return f"<InvoiceItem(id={self.id}, invoice_id={self.invoice_id}, desc='{self.description}', qty={self.quantity}, total={self.total_price})>"
