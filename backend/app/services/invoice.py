"""CRUD service for Invoice and InvoiceItem entities."""

from decimal import Decimal
from typing import Optional, Sequence
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.invoice import Invoice, InvoiceStatus
from app.models.invoice_item import InvoiceItem
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate
from app.schemas.invoice_item import InvoiceItemCreate


def _compute_item_total(quantity: int, unit_price: Decimal) -> Decimal:
    """Calculate total_price for an invoice line item."""
    return Decimal(str(quantity)) * unit_price


def _recalculate_invoice_subtotal(invoice: Invoice) -> None:
    """Recalculate invoice subtotal from its items and update total_amount."""
    subtotal = sum(
        (item.total_price for item in invoice.items), Decimal("0.00")
    )
    invoice.subtotal = subtotal
    invoice.total_amount = subtotal + invoice.tax_amount - invoice.discount_amount


async def get_invoice(db: AsyncSession, invoice_id: int) -> Optional[Invoice]:
    """Fetch a single invoice by ID with eagerly loaded items."""
    result = await db.execute(
        select(Invoice)
        .options(selectinload(Invoice.items))
        .where(Invoice.id == invoice_id)
    )
    return result.scalar_one_or_none()


async def get_invoice_by_number(db: AsyncSession, invoice_number: str) -> Optional[Invoice]:
    """Fetch a single invoice by its unique invoice_number."""
    result = await db.execute(
        select(Invoice).where(Invoice.invoice_number == invoice_number)
    )
    return result.scalar_one_or_none()


async def list_invoices(
    db: AsyncSession,
    *,
    offset: int = 0,
    limit: int = 20,
    customer_id: Optional[int] = None,
    status: Optional[str] = None,
) -> tuple[Sequence[Invoice], int]:
    """List invoices with optional filters. Returns (items, total)."""
    query = select(Invoice).options(selectinload(Invoice.items))
    count_query = select(func.count(Invoice.id))

    if customer_id is not None:
        query = query.where(Invoice.customer_id == customer_id)
        count_query = count_query.where(Invoice.customer_id == customer_id)

    if status is not None:
        query = query.where(Invoice.status == status)
        count_query = count_query.where(Invoice.status == status)

    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    query = query.order_by(Invoice.id.desc()).offset(offset).limit(limit)
    result = await db.execute(query)
    items = result.unique().scalars().all()

    return items, total


async def create_invoice(db: AsyncSession, data: InvoiceCreate) -> Invoice:
    """Create a new invoice with optional line items."""
    invoice_data = data.model_dump(exclude={"items"})
    invoice = Invoice(**invoice_data)

    # Set monetary defaults if not provided
    invoice.subtotal = Decimal("0.00")
    if invoice.tax_amount is None:
        invoice.tax_amount = Decimal("0.00")
    if invoice.discount_amount is None:
        invoice.discount_amount = Decimal("0.00")
    invoice.total_amount = Decimal("0.00")

    db.add(invoice)
    await db.flush()  # Get invoice.id for item references

    # Add line items
    for item_data in data.items:
        total_price = _compute_item_total(item_data.quantity, item_data.unit_price)
        item = InvoiceItem(
            invoice_id=invoice.id,
            product_id=item_data.product_id,
            description=item_data.description,
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            total_price=total_price,
        )
        db.add(item)

    await db.flush()
    # Reload items relationship to recalculate
    await db.refresh(invoice, attribute_names=["items"])
    _recalculate_invoice_subtotal(invoice)

    await db.commit()
    reloaded = await get_invoice(db, invoice.id)
    return reloaded or invoice


async def update_invoice(
    db: AsyncSession, invoice: Invoice, data: InvoiceUpdate
) -> Invoice:
    """Update invoice header fields (not items)."""
    update_data = data.model_dump(exclude_unset=True)

    # Validate status transition if status is being updated
    if "status" in update_data:
        new_status = update_data["status"]
        valid_statuses = {s.value for s in InvoiceStatus}
        if new_status not in valid_statuses:
            raise ValueError(f"Status tidak valid: {new_status}. Pilihan: {valid_statuses}")

    for field, value in update_data.items():
        setattr(invoice, field, value)

    await db.commit()
    reloaded = await get_invoice(db, invoice.id)
    return reloaded or invoice


async def update_invoice_status(
    db: AsyncSession, invoice: Invoice, new_status: str
) -> Invoice:
    """Update only the status of an invoice with validation."""
    valid_statuses = {s.value for s in InvoiceStatus}
    if new_status not in valid_statuses:
        raise ValueError(f"Status tidak valid: {new_status}. Pilihan: {valid_statuses}")

    invoice.status = new_status
    await db.commit()
    reloaded = await get_invoice(db, invoice.id)
    return reloaded or invoice


async def add_invoice_item(
    db: AsyncSession, invoice: Invoice, data: InvoiceItemCreate
) -> Invoice:
    """Add a single line item to an existing invoice and recalculate totals."""
    total_price = _compute_item_total(data.quantity, data.unit_price)
    item = InvoiceItem(
        invoice_id=invoice.id,
        product_id=data.product_id,
        description=data.description,
        quantity=data.quantity,
        unit_price=data.unit_price,
        total_price=total_price,
    )
    db.add(item)
    await db.flush()
    await db.refresh(invoice, attribute_names=["items"])
    _recalculate_invoice_subtotal(invoice)
    await db.commit()
    reloaded = await get_invoice(db, invoice.id)
    return reloaded or invoice


async def delete_invoice(db: AsyncSession, invoice: Invoice) -> None:
    """Delete an invoice (cascades to items)."""
    await db.delete(invoice)
    await db.commit()
