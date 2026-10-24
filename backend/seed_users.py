import asyncio
from app.core.database import AsyncSessionLocal
from app.models.user import User, UserRole
from app.core.security import hash_password
from sqlalchemy import select

async def seed():
    async with AsyncSessionLocal() as db:
        defaults = [
            {
                "email": "owner@dailydose.ai",
                "full_name": "Aditya Dharma",
                "role": UserRole.OWNER.value,
                "password": "OwnerPass123!",
            },
            {
                "email": "admin@dailydose.ai",
                "full_name": "Siti Rahma",
                "role": UserRole.ADMIN.value,
                "password": "AdminPass123!",
            },
            {
                "email": "finance@dailydose.ai",
                "full_name": "Budi Santoso",
                "role": UserRole.FINANCE.value,
                "password": "FinancePass123!",
            },
        ]
        for d in defaults:
            stmt = select(User).where(User.email == d["email"])
            res = await db.execute(stmt)
            existing = res.scalar_one_or_none()
            if not existing:
                u = User(
                    email=d["email"],
                    full_name=d["full_name"],
                    role=d["role"],
                    hashed_password=hash_password(d["password"]),
                    is_active=True,
                )
                db.add(u)
                print(f"Created user: {d['email']} ({d['role']})")
            else:
                print(f"User already exists: {d['email']}")
        await db.commit()
        print("Default users seeding finished successfully.")

if __name__ == "__main__":
    asyncio.run(seed())
