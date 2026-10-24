"""CRUD service for Customer entity."""

from typing import Optional, Sequence
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate


async def get_customer(db: AsyncSession, customer_id: int) -> Optional[Customer]:
    """Fetch a single customer by ID."""
    result = await db.execute(select(Customer).where(Customer.id == customer_id))
    return result.scalar_one_or_none()


async def get_customer_by_email(db: AsyncSession, email: str) -> Optional[Customer]:
    """Fetch a single customer by email."""
    result = await db.execute(select(Customer).where(Customer.email == email))
    return result.scalar_one_or_none()


async def list_customers(
    db: AsyncSession,
    *,
    offset: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
) -> tuple[Sequence[Customer], int]:
    """List customers with optional search and active filter. Returns (items, total)."""
    query = select(Customer)
    count_query = select(func.count(Customer.id))

    if search:
        pattern = f"%{search}%"
        filter_clause = Customer.name.ilike(pattern) | Customer.email.ilike(pattern)
        query = query.where(filter_clause)
        count_query = count_query.where(filter_clause)

    if is_active is not None:
        query = query.where(Customer.is_active == is_active)
        count_query = count_query.where(Customer.is_active == is_active)

    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    query = query.order_by(Customer.id.desc()).offset(offset).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()

    return items, total


async def create_customer(db: AsyncSession, data: CustomerCreate) -> Customer:
    """Create a new customer."""
    customer = Customer(**data.model_dump())
    db.add(customer)
    await db.commit()
    await db.refresh(customer)
    return customer


async def update_customer(
    db: AsyncSession, customer: Customer, data: CustomerUpdate
) -> Customer:
    """Update an existing customer with partial data."""
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(customer, field, value)
    await db.commit()
    await db.refresh(customer)
    return customer


async def delete_customer(db: AsyncSession, customer: Customer) -> None:
    """Delete a customer."""
    await db.delete(customer)
    await db.commit()
