from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional
from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.customer import Customer


class TaskStatus(str, Enum):
    """Status pekerjaan atau tindak lanjut bisnis."""
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class TaskPriority(str, Enum):
    """Tingkat prioritas task bisnis."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"


class Task(Base):
    """Tindak lanjut atau pekerjaan bisnis untuk DailyDose AI."""

    __tablename__ = "tasks"
    __table_args__ = (
        CheckConstraint(
            "status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')",
            name="chk_tasks_status_valid",
        ),
        CheckConstraint(
            "priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')",
            name="chk_tasks_priority_valid",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default=TaskStatus.PENDING.value,
        index=True,
    )
    priority: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default=TaskPriority.MEDIUM.value,
        index=True,
    )
    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relasi opsional ke Customer (SET NULL jika customer dihapus agar history pekerjaan tidak hilang)
    customer_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("customers.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

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

    # Relasi
    customer: Mapped[Optional["Customer"]] = relationship("Customer", back_populates="tasks")

    def __repr__(self) -> str:
        return f"<Task(id={self.id}, title='{self.title}', status='{self.status}', priority='{self.priority}')>"
