"""Utility script to quickly inspect the contents of PostgreSQL database tables in terminal."""

import asyncio
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.customer import Customer
from app.models.product import Product
from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem
from app.models.task import Task
from app.models.user import User


def format_table(headers, rows):
    """Simple terminal ASCII table formatter without external dependencies."""
    if not rows:
        return "  (Kosong / Belum ada data)\n"
    
    col_widths = [len(h) for h in headers]
    for row in rows:
        for idx, cell in enumerate(row):
            col_widths[idx] = max(col_widths[idx], len(str(cell)))
    
    border = "+-" + "-+-".join("-" * w for w in col_widths) + "-+"
    header_line = "| " + " | ".join(h.ljust(col_widths[idx]) for idx, h in enumerate(headers)) + " |"
    
    lines = [border, header_line, border]
    for row in rows:
        lines.append("| " + " | ".join(str(cell).ljust(col_widths[idx]) for idx, cell in enumerate(row)) + " |")
    lines.append(border)
    return "\n".join(lines) + "\n"


async def inspect_db():
    async with AsyncSessionLocal() as session:
        print("\n" + "=" * 70)
        print("          ISI DATABASE POSTGRESQL (dailydose_db)")
        print("=" * 70)

        # 1. Customers
        print("\n[TABEL: customers]")
        cust_res = await session.execute(select(Customer).order_by(Customer.id))
        custs = cust_res.scalars().all()
        cust_rows = [
            [c.id, c.name, c.email, c.phone or "-", "Aktif" if c.is_active else "Nonaktif"]
            for c in custs
        ]
        print(format_table(["ID", "Nama Pelanggan", "Email", "Telepon", "Status"], cust_rows))

        # 2. Products
        print("\n[TABEL: products]")
        prod_res = await session.execute(select(Product).order_by(Product.id))
        prods = prod_res.scalars().all()
        prod_rows = [
            [p.id, p.sku, p.name, f"Rp {int(p.price):,}".replace(",", "."), f"{p.stock} unit"]
            for p in prods
        ]
        print(format_table(["ID", "SKU", "Nama Produk", "Harga Satuan", "Stok"], prod_rows))

        # 3. Invoices
        print("\n[TABEL: invoices]")
        inv_res = await session.execute(select(Invoice).order_by(Invoice.id))
        invs = inv_res.scalars().all()
        inv_rows = [
            [
                i.id,
                i.invoice_number,
                f"Cust #{i.customer_id}",
                i.status,
                f"Rp {int(i.total_amount):,}".replace(",", "."),
                str(i.issue_date),
            ]
            for i in invs
        ]
        print(format_table(["ID", "Nomor Invoice", "Customer", "Status", "Total", "Tanggal"], inv_rows))

        # 4. Tasks
        print("\n[TABEL: tasks]")
        task_res = await session.execute(select(Task).order_by(Task.id))
        tasks = task_res.scalars().all()
        task_rows = [
            [t.id, t.title[:40], t.status, t.priority, f"Cust #{t.customer_id}" if t.customer_id else "-"]
            for t in tasks
        ]
        print(format_table(["ID", "Judul Tugas", "Status", "Prioritas", "Customer"], task_rows))

        # 5. Users (Akun Otorisasi Owner & Admin)
        print("\n[TABEL: users (Akun Terdaftar di PostgreSQL)]")
        user_res = await session.execute(select(User).order_by(User.id))
        users = user_res.scalars().all()
        user_rows = [
            [u.id, u.full_name, u.email, u.role, "Aktif" if u.is_active else "Nonaktif", str(u.created_at)[:19]]
            for u in users
        ]
        print(format_table(["ID", "Nama Pengguna", "Email", "Peran (Role)", "Status", "Terdaftar"], user_rows))


if __name__ == "__main__":
    asyncio.run(inspect_db())
