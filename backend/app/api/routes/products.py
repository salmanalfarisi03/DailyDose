"""API routes for Product CRUD operations."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.services import product as product_service

router = APIRouter(prefix="/products", tags=["Products"])


@router.get(
    "",
    response_model=PaginatedResponse[ProductResponse],
    summary="Daftar produk dengan pagination dan filter",
)
async def list_products(
    offset: int = Query(default=0, ge=0, description="Offset pagination"),
    limit: int = Query(default=20, ge=1, le=100, description="Jumlah per halaman"),
    search: Optional[str] = Query(default=None, description="Cari nama/SKU"),
    is_active: Optional[bool] = Query(default=None, description="Filter status aktif"),
    db: AsyncSession = Depends(get_db),
):
    items, total = await product_service.list_products(
        db, offset=offset, limit=limit, search=search, is_active=is_active
    )
    return PaginatedResponse(
        items=[ProductResponse.model_validate(p) for p in items],
        total=total,
        limit=limit,
        offset=offset,
        has_more=(offset + limit) < total,
    )


@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    summary="Detail produk berdasarkan ID",
)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    product = await product_service.get_product(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product dengan ID {product_id} tidak ditemukan.",
        )
    return ProductResponse.model_validate(product)


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Buat produk baru",
)
async def create_product(data: ProductCreate, db: AsyncSession = Depends(get_db)):
    # Check SKU uniqueness
    if data.sku:
        existing = await product_service.get_product_by_sku(db, data.sku)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"SKU '{data.sku}' sudah digunakan oleh produk lain.",
            )
    try:
        product = await product_service.create_product(db, data)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Data produk melanggar constraint unik di database.",
        )
    return ProductResponse.model_validate(product)


@router.patch(
    "/{product_id}",
    response_model=ProductResponse,
    summary="Update sebagian data produk",
)
async def update_product(
    product_id: int, data: ProductUpdate, db: AsyncSession = Depends(get_db)
):
    product = await product_service.get_product(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product dengan ID {product_id} tidak ditemukan.",
        )
    if data.sku and data.sku != product.sku:
        existing = await product_service.get_product_by_sku(db, data.sku)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"SKU '{data.sku}' sudah digunakan oleh produk lain.",
            )
    try:
        updated = await product_service.update_product(db, product, data)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Data produk melanggar constraint unik di database.",
        )
    return ProductResponse.model_validate(updated)


@router.delete(
    "/{product_id}",
    response_model=MessageResponse,
    summary="Hapus produk",
)
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    product = await product_service.get_product(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product dengan ID {product_id} tidak ditemukan.",
        )
    try:
        await product_service.delete_product(db, product)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Produk tidak dapat dihapus karena masih digunakan pada invoice item.",
        )
    return MessageResponse(
        message=f"Product '{product.name}' (ID: {product_id}) berhasil dihapus."
    )
