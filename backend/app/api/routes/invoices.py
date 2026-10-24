"""API routes for Invoice CRUD operations."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.invoice import (
    InvoiceCreate,
    InvoiceUpdate,
    InvoiceStatusUpdate,
    InvoiceResponse,
)
from app.schemas.invoice_item import InvoiceItemCreate
from app.services import invoice as invoice_service
from app.services import customer as customer_service

router = APIRouter(prefix="/invoices", tags=["Invoices"])


@router.get(
    "",
    response_model=PaginatedResponse[InvoiceResponse],
    summary="Daftar invoice dengan pagination dan filter",
)
async def list_invoices(
    offset: int = Query(default=0, ge=0, description="Offset pagination"),
    limit: int = Query(default=20, ge=1, le=100, description="Jumlah per halaman"),
    customer_id: Optional[int] = Query(default=None, description="Filter by customer ID"),
    status_filter: Optional[str] = Query(
        default=None, alias="status", description="Filter by status (DRAFT, ISSUED, PAID, etc.)"
    ),
    db: AsyncSession = Depends(get_db),
):
    items, total = await invoice_service.list_invoices(
        db, offset=offset, limit=limit, customer_id=customer_id, status=status_filter
    )
    return PaginatedResponse(
        items=[InvoiceResponse.model_validate(inv) for inv in items],
        total=total,
        limit=limit,
        offset=offset,
        has_more=(offset + limit) < total,
    )


@router.get(
    "/{invoice_id}",
    response_model=InvoiceResponse,
    summary="Detail invoice berdasarkan ID (termasuk items)",
)
async def get_invoice(invoice_id: int, db: AsyncSession = Depends(get_db)):
    invoice = await invoice_service.get_invoice(db, invoice_id)
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Invoice dengan ID {invoice_id} tidak ditemukan.",
        )
    return InvoiceResponse.model_validate(invoice)


@router.post(
    "",
    response_model=InvoiceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Buat invoice baru (dengan item opsional)",
)
async def create_invoice(data: InvoiceCreate, db: AsyncSession = Depends(get_db)):
    # Validate customer exists
    customer = await customer_service.get_customer(db, data.customer_id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer dengan ID {data.customer_id} tidak ditemukan.",
        )
    # Check invoice number uniqueness
    existing = await invoice_service.get_invoice_by_number(db, data.invoice_number)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Nomor invoice '{data.invoice_number}' sudah digunakan.",
        )
    try:
        invoice = await invoice_service.create_invoice(db, data)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Data invoice melanggar constraint di database.",
        )
    return InvoiceResponse.model_validate(invoice)


@router.patch(
    "/{invoice_id}",
    response_model=InvoiceResponse,
    summary="Update data invoice (header saja, tanpa items)",
)
async def update_invoice(
    invoice_id: int, data: InvoiceUpdate, db: AsyncSession = Depends(get_db)
):
    invoice = await invoice_service.get_invoice(db, invoice_id)
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Invoice dengan ID {invoice_id} tidak ditemukan.",
        )
    # Validate customer if changing
    if data.customer_id is not None:
        customer = await customer_service.get_customer(db, data.customer_id)
        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Customer dengan ID {data.customer_id} tidak ditemukan.",
            )
    # Validate invoice_number uniqueness if changing
    if data.invoice_number and data.invoice_number != invoice.invoice_number:
        existing = await invoice_service.get_invoice_by_number(db, data.invoice_number)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Nomor invoice '{data.invoice_number}' sudah digunakan.",
            )
    try:
        updated = await invoice_service.update_invoice(db, invoice, data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Data invoice melanggar constraint di database.",
        )
    return InvoiceResponse.model_validate(updated)


@router.patch(
    "/{invoice_id}/status",
    response_model=InvoiceResponse,
    summary="Ubah status invoice (DRAFT → ISSUED → PAID, dll.)",
)
async def update_invoice_status(
    invoice_id: int, data: InvoiceStatusUpdate, db: AsyncSession = Depends(get_db)
):
    invoice = await invoice_service.get_invoice(db, invoice_id)
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Invoice dengan ID {invoice_id} tidak ditemukan.",
        )
    try:
        updated = await invoice_service.update_invoice_status(db, invoice, data.status)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    return InvoiceResponse.model_validate(updated)


@router.post(
    "/{invoice_id}/items",
    response_model=InvoiceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Tambah item ke invoice yang sudah ada",
)
async def add_invoice_item(
    invoice_id: int, data: InvoiceItemCreate, db: AsyncSession = Depends(get_db)
):
    invoice = await invoice_service.get_invoice(db, invoice_id)
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Invoice dengan ID {invoice_id} tidak ditemukan.",
        )
    try:
        updated = await invoice_service.add_invoice_item(db, invoice, data)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Data item melanggar constraint di database.",
        )
    return InvoiceResponse.model_validate(updated)


@router.delete(
    "/{invoice_id}",
    response_model=MessageResponse,
    summary="Hapus invoice beserta seluruh item-nya",
)
async def delete_invoice(invoice_id: int, db: AsyncSession = Depends(get_db)):
    invoice = await invoice_service.get_invoice(db, invoice_id)
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Invoice dengan ID {invoice_id} tidak ditemukan.",
        )
    await invoice_service.delete_invoice(db, invoice)
    return MessageResponse(
        message=f"Invoice '{invoice.invoice_number}' (ID: {invoice_id}) beserta seluruh item berhasil dihapus."
    )
