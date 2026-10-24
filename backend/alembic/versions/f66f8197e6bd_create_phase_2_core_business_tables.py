"""create_phase_2_core_business_tables

Revision ID: f66f8197e6bd
Revises: 
Create Date: 2026-10-20 13:33:29.056512

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f66f8197e6bd'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: Create customers, products, invoices, invoice_items, and tasks tables."""

    # 1. Table: customers
    op.create_table(
        'customers',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_customers_id'), 'customers', ['id'], unique=False)
    op.create_index(op.f('ix_customers_name'), 'customers', ['name'], unique=False)
    op.create_index(op.f('ix_customers_email'), 'customers', ['email'], unique=True)

    # 2. Table: products
    op.create_table(
        'products',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('sku', sa.String(length=100), nullable=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('price', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('stock', sa.Integer(), server_default=sa.text('0'), nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.CheckConstraint('price >= 0', name='chk_products_price_non_negative'),
        sa.CheckConstraint('stock >= 0', name='chk_products_stock_non_negative'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_products_id'), 'products', ['id'], unique=False)
    op.create_index(op.f('ix_products_name'), 'products', ['name'], unique=False)
    op.create_index(op.f('ix_products_sku'), 'products', ['sku'], unique=True)

    # 3. Table: invoices
    op.create_table(
        'invoices',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('invoice_number', sa.String(length=50), nullable=False),
        sa.Column('customer_id', sa.Integer(), nullable=False),
        sa.Column('issue_date', sa.Date(), server_default=sa.text('CURRENT_DATE'), nullable=False),
        sa.Column('due_date', sa.Date(), nullable=True),
        sa.Column('status', sa.String(length=30), server_default=sa.text("'DRAFT'"), nullable=False),
        sa.Column('subtotal', sa.Numeric(precision=12, scale=2), server_default=sa.text('0.00'), nullable=False),
        sa.Column('tax_amount', sa.Numeric(precision=12, scale=2), server_default=sa.text('0.00'), nullable=False),
        sa.Column('discount_amount', sa.Numeric(precision=12, scale=2), server_default=sa.text('0.00'), nullable=False),
        sa.Column('total_amount', sa.Numeric(precision=12, scale=2), server_default=sa.text('0.00'), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.CheckConstraint(
            "status IN ('DRAFT', 'ISSUED', 'PAID', 'CANCELLED', 'OVERDUE')",
            name='chk_invoices_status_valid'
        ),
        sa.CheckConstraint('subtotal >= 0', name='chk_invoices_subtotal_non_negative'),
        sa.CheckConstraint('tax_amount >= 0', name='chk_invoices_tax_amount_non_negative'),
        sa.CheckConstraint('discount_amount >= 0', name='chk_invoices_discount_amount_non_negative'),
        sa.CheckConstraint('total_amount >= 0', name='chk_invoices_total_amount_non_negative'),
        sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_invoices_id'), 'invoices', ['id'], unique=False)
    op.create_index(op.f('ix_invoices_customer_id'), 'invoices', ['customer_id'], unique=False)
    op.create_index(op.f('ix_invoices_invoice_number'), 'invoices', ['invoice_number'], unique=True)
    op.create_index(op.f('ix_invoices_status'), 'invoices', ['status'], unique=False)

    # 4. Table: invoice_items
    op.create_table(
        'invoice_items',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('invoice_id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=True),
        sa.Column('description', sa.String(length=255), nullable=False),
        sa.Column('quantity', sa.Integer(), server_default=sa.text('1'), nullable=False),
        sa.Column('unit_price', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('total_price', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.CheckConstraint('quantity > 0', name='chk_invoice_items_quantity_positive'),
        sa.CheckConstraint('unit_price >= 0', name='chk_invoice_items_unit_price_non_negative'),
        sa.CheckConstraint('total_price >= 0', name='chk_invoice_items_total_price_non_negative'),
        sa.ForeignKeyConstraint(['invoice_id'], ['invoices.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_invoice_items_id'), 'invoice_items', ['id'], unique=False)
    op.create_index(op.f('ix_invoice_items_invoice_id'), 'invoice_items', ['invoice_id'], unique=False)
    op.create_index(op.f('ix_invoice_items_product_id'), 'invoice_items', ['product_id'], unique=False)

    # 5. Table: tasks
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=30), server_default=sa.text("'PENDING'"), nullable=False),
        sa.Column('priority', sa.String(length=30), server_default=sa.text("'MEDIUM'"), nullable=False),
        sa.Column('due_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('customer_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.CheckConstraint(
            "status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')",
            name='chk_tasks_status_valid'
        ),
        sa.CheckConstraint(
            "priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')",
            name='chk_tasks_priority_valid'
        ),
        sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tasks_id'), 'tasks', ['id'], unique=False)
    op.create_index(op.f('ix_tasks_title'), 'tasks', ['title'], unique=False)
    op.create_index(op.f('ix_tasks_status'), 'tasks', ['status'], unique=False)
    op.create_index(op.f('ix_tasks_priority'), 'tasks', ['priority'], unique=False)
    op.create_index(op.f('ix_tasks_customer_id'), 'tasks', ['customer_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema: Drop tables in reverse order of foreign key dependency."""
    op.drop_index(op.f('ix_tasks_customer_id'), table_name='tasks')
    op.drop_index(op.f('ix_tasks_priority'), table_name='tasks')
    op.drop_index(op.f('ix_tasks_status'), table_name='tasks')
    op.drop_index(op.f('ix_tasks_title'), table_name='tasks')
    op.drop_index(op.f('ix_tasks_id'), table_name='tasks')
    op.drop_table('tasks')

    op.drop_index(op.f('ix_invoice_items_product_id'), table_name='invoice_items')
    op.drop_index(op.f('ix_invoice_items_invoice_id'), table_name='invoice_items')
    op.drop_index(op.f('ix_invoice_items_id'), table_name='invoice_items')
    op.drop_table('invoice_items')

    op.drop_index(op.f('ix_invoices_status'), table_name='invoices')
    op.drop_index(op.f('ix_invoices_invoice_number'), table_name='invoices')
    op.drop_index(op.f('ix_invoices_customer_id'), table_name='invoices')
    op.drop_index(op.f('ix_invoices_id'), table_name='invoices')
    op.drop_table('invoices')

    op.drop_index(op.f('ix_products_sku'), table_name='products')
    op.drop_index(op.f('ix_products_name'), table_name='products')
    op.drop_index(op.f('ix_products_id'), table_name='products')
    op.drop_table('products')

    op.drop_index(op.f('ix_customers_email'), table_name='customers')
    op.drop_index(op.f('ix_customers_name'), table_name='customers')
    op.drop_index(op.f('ix_customers_id'), table_name='customers')
    op.drop_table('customers')
