from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.customer import Customer
    from app.models.invoice_item import InvoiceItem


class InvoiceStatus(str, Enum):
    """Nilai status invoice yang terdefinisi."""
    DRAFT = "DRAFT"
    ISSUED = "ISSUED"
    PAID = "PAID"
    CANCELLED = "CANCELLED"
    OVERDUE = "OVERDUE"


class Invoice(Base):
    """Informasi tagihan dan status pembayaran untuk DailyDose AI."""

    __tablename__ = "invoices"
    __table_args__ = (
        CheckConstraint(
            "status IN ('DRAFT', 'ISSUED', 'PAID', 'CANCELLED', 'OVERDUE')",
            name="chk_invoices_status_valid",
        ),
        CheckConstraint("subtotal >= 0", name="chk_invoices_subtotal_non_negative"),
        CheckConstraint("tax_amount >= 0", name="chk_invoices_tax_amount_non_negative"),
        CheckConstraint("discount_amount >= 0", name="chk_invoices_discount_amount_non_negative"),
        CheckConstraint("total_amount >= 0", name="chk_invoices_total_amount_non_negative"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    invoice_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    customer_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("customers.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    issue_date: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default=InvoiceStatus.DRAFT.value,
        index=True,
    )

    # Nilai numerik moneter yang aman
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    tax_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    discount_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    total_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))

    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

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

    # Relasi: Customer
    customer: Mapped["Customer"] = relationship("Customer", back_populates="invoices")

    # Relasi: Invoice Items (Cascade delete jika invoice dihapus)
    items: Mapped[List["InvoiceItem"]] = relationship(
        "InvoiceItem",
        back_populates="invoice",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self) -> str:
        return f"<Invoice(id={self.id}, number='{self.invoice_number}', status='{self.status}', total={self.total_amount})>"
