from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.invoice import Invoice
    from app.models.task import Task


class Customer(Base):
    """Data pelanggan untuk DailyDose AI."""

    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True, nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
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

    # Relasi: Invoices (ondelete RESTRICT mencegah hapus customer jika ada invoice)
    invoices: Mapped[List["Invoice"]] = relationship(
        "Invoice",
        back_populates="customer",
        passive_deletes="all",
    )

    # Relasi: Tasks
    tasks: Mapped[List["Task"]] = relationship(
        "Task",
        back_populates="customer",
        passive_deletes="all",
    )

    def __repr__(self) -> str:
        return f"<Customer(id={self.id}, name='{self.name}', email='{self.email}')>"
