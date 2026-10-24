"""API routes for Customer CRUD operations."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse
from app.services import customer as customer_service

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get(
    "",
    response_model=PaginatedResponse[CustomerResponse],
    summary="Daftar pelanggan dengan pagination dan filter",
)
async def list_customers(
    offset: int = Query(default=0, ge=0, description="Offset pagination"),
    limit: int = Query(default=20, ge=1, le=100, description="Jumlah per halaman"),
    search: Optional[str] = Query(default=None, description="Cari nama/email"),
    is_active: Optional[bool] = Query(default=None, description="Filter status aktif"),
    db: AsyncSession = Depends(get_db),
):
    items, total = await customer_service.list_customers(
        db, offset=offset, limit=limit, search=search, is_active=is_active
    )
    return PaginatedResponse(
        items=[CustomerResponse.model_validate(c) for c in items],
        total=total,
        limit=limit,
        offset=offset,
        has_more=(offset + limit) < total,
    )


@router.get(
    "/{customer_id}",
    response_model=CustomerResponse,
    summary="Detail pelanggan berdasarkan ID",
)
async def get_customer(customer_id: int, db: AsyncSession = Depends(get_db)):
    customer = await customer_service.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer dengan ID {customer_id} tidak ditemukan.",
        )
    return CustomerResponse.model_validate(customer)


@router.post(
    "",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Buat pelanggan baru",
)
async def create_customer(data: CustomerCreate, db: AsyncSession = Depends(get_db)):
    # Check email uniqueness
    if data.email:
        existing = await customer_service.get_customer_by_email(db, data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Email '{data.email}' sudah digunakan oleh pelanggan lain.",
            )
    try:
        customer = await customer_service.create_customer(db, data)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Data pelanggan melanggar constraint unik di database.",
        )
    return CustomerResponse.model_validate(customer)


@router.patch(
    "/{customer_id}",
    response_model=CustomerResponse,
    summary="Update sebagian data pelanggan",
)
async def update_customer(
    customer_id: int, data: CustomerUpdate, db: AsyncSession = Depends(get_db)
):
    customer = await customer_service.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer dengan ID {customer_id} tidak ditemukan.",
        )
    # Check email uniqueness if email is being changed
    if data.email and data.email != customer.email:
        existing = await customer_service.get_customer_by_email(db, data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Email '{data.email}' sudah digunakan oleh pelanggan lain.",
            )
    try:
        updated = await customer_service.update_customer(db, customer, data)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Data pelanggan melanggar constraint unik di database.",
        )
    return CustomerResponse.model_validate(updated)


@router.delete(
    "/{customer_id}",
    response_model=MessageResponse,
    summary="Hapus pelanggan",
)
async def delete_customer(customer_id: int, db: AsyncSession = Depends(get_db)):
    customer = await customer_service.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer dengan ID {customer_id} tidak ditemukan.",
        )
    try:
        await customer_service.delete_customer(db, customer)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Pelanggan tidak dapat dihapus karena masih memiliki invoice atau task terkait.",
        )
    return MessageResponse(
        message=f"Customer '{customer.name}' (ID: {customer_id}) berhasil dihapus."
    )
