from decimal import Decimal
from datetime import date
from sqlalchemy import Numeric
from app.models import (
    Base,
    Customer,
    Product,
    Invoice,
    InvoiceStatus,
    InvoiceItem,
    Task,
    TaskStatus,
    TaskPriority,
)


def test_metadata_contains_all_phase_2_tables():
    """Verify that all 5 Phase 2 tables are properly registered in SQLAlchemy metadata."""
    table_names = set(Base.metadata.tables.keys())
    expected_tables = {"customers", "products", "invoices", "invoice_items", "tasks"}
    assert expected_tables.issubset(table_names)


def test_monetary_fields_use_numeric_not_float():
    """Ensure monetary fields strictly use Numeric/Decimal types, never floating point."""
    products_table = Base.metadata.tables["products"]
    assert isinstance(products_table.c.price.type, Numeric)

    invoices_table = Base.metadata.tables["invoices"]
    assert isinstance(invoices_table.c.subtotal.type, Numeric)
    assert isinstance(invoices_table.c.tax_amount.type, Numeric)
    assert isinstance(invoices_table.c.discount_amount.type, Numeric)
    assert isinstance(invoices_table.c.total_amount.type, Numeric)

    invoice_items_table = Base.metadata.tables["invoice_items"]
    assert isinstance(invoice_items_table.c.unit_price.type, Numeric)
    assert isinstance(invoice_items_table.c.total_price.type, Numeric)


def test_foreign_key_delete_rules():
    """Verify safe relationship deletion rules (CASCADE, RESTRICT, SET NULL)."""
    invoices_table = Base.metadata.tables["invoices"]
    customer_fk = list(invoices_table.c.customer_id.foreign_keys)[0]
    assert customer_fk.column.table.name == "customers"
    assert customer_fk.ondelete == "RESTRICT"

    invoice_items_table = Base.metadata.tables["invoice_items"]
    invoice_fk = list(invoice_items_table.c.invoice_id.foreign_keys)[0]
    assert invoice_fk.column.table.name == "invoices"
    assert invoice_fk.ondelete == "CASCADE"

    product_fk = list(invoice_items_table.c.product_id.foreign_keys)[0]
    assert product_fk.column.table.name == "products"
    assert product_fk.ondelete == "RESTRICT"

    tasks_table = Base.metadata.tables["tasks"]
    task_customer_fk = list(tasks_table.c.customer_id.foreign_keys)[0]
    assert task_customer_fk.column.table.name == "customers"
    assert task_customer_fk.ondelete == "SET NULL"


def test_check_constraints_present():
    """Verify that check constraints are applied to prevent negative values and invalid statuses."""
    products_table = Base.metadata.tables["products"]
    constraint_names = {c.name for c in products_table.constraints if hasattr(c, "name") and c.name}
    assert "chk_products_price_non_negative" in constraint_names
    assert "chk_products_stock_non_negative" in constraint_names

    invoices_table = Base.metadata.tables["invoices"]
    inv_constraint_names = {c.name for c in invoices_table.constraints if hasattr(c, "name") and c.name}
    assert "chk_invoices_status_valid" in inv_constraint_names
    assert "chk_invoices_total_amount_non_negative" in inv_constraint_names

    items_table = Base.metadata.tables["invoice_items"]
    item_constraint_names = {c.name for c in items_table.constraints if hasattr(c, "name") and c.name}
    assert "chk_invoice_items_quantity_positive" in item_constraint_names

    tasks_table = Base.metadata.tables["tasks"]
    task_constraint_names = {c.name for c in tasks_table.constraints if hasattr(c, "name") and c.name}
    assert "chk_tasks_status_valid" in task_constraint_names
    assert "chk_tasks_priority_valid" in task_constraint_names


def test_model_instantiation():
    """Verify that models can be cleanly instantiated with correct types and attributes."""
    customer = Customer(name="PT Solusi Digital", email="info@solusidigital.id", phone="08123456789", is_active=True)
    assert customer.name == "PT Solusi Digital"
    assert customer.is_active is True

    product = Product(name="DailyDose AI License", price=Decimal("1500000.00"), stock=100, is_active=True)
    assert product.price == Decimal("1500000.00")
    assert product.stock == 100
    assert product.is_active is True

    invoice = Invoice(
        invoice_number="INV-202610-001",
        customer_id=1,
        issue_date=date(2026, 10, 20),
        status=InvoiceStatus.DRAFT.value,
        total_amount=Decimal("1500000.00"),
    )
    assert invoice.status == "DRAFT"
    assert invoice.total_amount == Decimal("1500000.00")

    item = InvoiceItem(
        invoice_id=1,
        product_id=1,
        description="DailyDose AI Subscription - 1 Month",
        quantity=1,
        unit_price=Decimal("1500000.00"),
        total_price=Decimal("1500000.00"),
    )
    assert item.quantity == 1

    task = Task(
        title="Follow-up onboarding PT Solusi Digital",
        status=TaskStatus.PENDING.value,
        priority=TaskPriority.HIGH.value,
        customer_id=1,
    )
    assert task.status == "PENDING"
    assert task.priority == "HIGH"
