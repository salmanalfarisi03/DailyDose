from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import generate_session_token, hash_password, verify_password
from app.models.user import User, UserRole
from app.schemas.user import LoginResponse, UserCreate, UserLogin, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication & Access Control"])


@router.post("/login", response_model=LoginResponse, summary="Autentikasi login akun Owner / Admin")
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Verifikasi email dan kata sandi akun terhadap database PostgreSQL."""
    email_clean = credentials.email.strip().lower()

    stmt = select(User).where(User.email.ilike(email_clean))
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau kata sandi tidak sesuai. Pastikan akun terdaftar di database.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun ini telah dinonaktifkan oleh administrator.",
        )

    token = generate_session_token()
    return LoginResponse(
        user=UserResponse.model_validate(user),
        token=token,
        message=f"Selamat datang kembali, {user.full_name} ({user.role}). Otorisasi berhasil.",
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="Daftarkan akun pengguna baru")
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """Membuat akun pengguna baru dan menyimpannya di PostgreSQL."""
    email_clean = user_in.email.strip().lower()

    # Cek duplikasi email
    stmt = select(User).where(User.email.ilike(email_clean))
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email '{user_in.email}' sudah terdaftar dalam sistem.",
        )

    # Validasi role
    role_val = user_in.role.upper()
    if role_val not in [r.value for r in UserRole]:
        role_val = UserRole.ADMIN.value

    new_user = User(
        email=email_clean,
        full_name=user_in.full_name.strip(),
        hashed_password=hash_password(user_in.password),
        role=role_val,
        is_active=True,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return UserResponse.model_validate(new_user)


@router.get("/users", response_model=List[UserResponse], summary="Daftar akun terdaftar di PostgreSQL")
async def list_users(db: AsyncSession = Depends(get_db)):
    """Mengambil seluruh daftar akun terdaftar di PostgreSQL untuk manajemen pengguna."""
    stmt = select(User).order_by(User.id.asc())
    result = await db.execute(stmt)
    users = result.scalars().all()
    return [UserResponse.model_validate(u) for u in users]


@router.post("/seed-defaults", summary="Inisialisasi akun bawaan Owner dan Admin ke PostgreSQL")
async def seed_default_accounts(db: AsyncSession = Depends(get_db)):
    """Memastikan akun Owner dan Admin default tersimpan aman di database PostgreSQL."""
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

    created = []
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
            created.append(d["email"])

    await db.commit()
    return {
        "status": "success",
        "message": f"Inisialisasi akun selesai. Akun baru ditambahkan: {len(created)}.",
        "created": created,
        "credentials_info": [
            {"email": "owner@dailydose.ai", "default_password": "OwnerPass123!", "role": "OWNER"},
            {"email": "admin@dailydose.ai", "default_password": "AdminPass123!", "role": "ADMIN"},
            {"email": "finance@dailydose.ai", "default_password": "FinancePass123!", "role": "FINANCE"},
        ],
    }
