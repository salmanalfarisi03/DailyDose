"""Pydantic schemas package for DailyDose AI."""

from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.health import DatabaseHealth, HealthResponse
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate, InvoiceStatusUpdate, InvoiceResponse
from app.schemas.invoice_item import InvoiceItemCreate, InvoiceItemUpdate, InvoiceItemResponse
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse

__all__ = [
    "MessageResponse",
    "PaginatedResponse",
    "DatabaseHealth",
    "HealthResponse",
    "CustomerCreate",
    "CustomerUpdate",
    "CustomerResponse",
    "ProductCreate",
    "ProductUpdate",
    "ProductResponse",
    "InvoiceCreate",
    "InvoiceUpdate",
    "InvoiceStatusUpdate",
    "InvoiceResponse",
    "InvoiceItemCreate",
    "InvoiceItemUpdate",
    "InvoiceItemResponse",
    "TaskCreate",
    "TaskUpdate",
    "TaskResponse",
]
