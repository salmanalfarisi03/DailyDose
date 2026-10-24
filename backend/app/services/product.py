"""CRUD service for Product entity."""

from typing import Optional, Sequence
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


async def get_product(db: AsyncSession, product_id: int) -> Optional[Product]:
    """Fetch a single product by ID."""
    result = await db.execute(select(Product).where(Product.id == product_id))
    return result.scalar_one_or_none()


async def get_product_by_sku(db: AsyncSession, sku: str) -> Optional[Product]:
    """Fetch a single product by SKU."""
    result = await db.execute(select(Product).where(Product.sku == sku))
    return result.scalar_one_or_none()


async def list_products(
    db: AsyncSession,
    *,
    offset: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
) -> tuple[Sequence[Product], int]:
    """List products with optional search and active filter. Returns (items, total)."""
    query = select(Product)
    count_query = select(func.count(Product.id))

    if search:
        pattern = f"%{search}%"
        filter_clause = Product.name.ilike(pattern) | Product.sku.ilike(pattern)
        query = query.where(filter_clause)
        count_query = count_query.where(filter_clause)

    if is_active is not None:
        query = query.where(Product.is_active == is_active)
        count_query = count_query.where(Product.is_active == is_active)

    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    query = query.order_by(Product.id.desc()).offset(offset).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()

    return items, total


async def create_product(db: AsyncSession, data: ProductCreate) -> Product:
    """Create a new product."""
    product = Product(**data.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


async def update_product(
    db: AsyncSession, product: Product, data: ProductUpdate
) -> Product:
    """Update an existing product with partial data."""
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    await db.commit()
    await db.refresh(product)
    return product


async def delete_product(db: AsyncSession, product: Product) -> None:
    """Delete a product."""
    await db.delete(product)
    await db.commit()
