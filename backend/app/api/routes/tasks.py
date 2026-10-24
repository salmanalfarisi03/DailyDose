"""API routes for Task CRUD operations."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services import task as task_service

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get(
    "",
    response_model=PaginatedResponse[TaskResponse],
    summary="Daftar task dengan pagination dan filter",
)
async def list_tasks(
    offset: int = Query(default=0, ge=0, description="Offset pagination"),
    limit: int = Query(default=20, ge=1, le=100, description="Jumlah per halaman"),
    search: Optional[str] = Query(default=None, description="Cari judul task"),
    status_filter: Optional[str] = Query(
        default=None, alias="status", description="Filter status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)"
    ),
    priority: Optional[str] = Query(
        default=None, description="Filter prioritas (LOW, MEDIUM, HIGH, URGENT)"
    ),
    customer_id: Optional[int] = Query(default=None, description="Filter by customer ID"),
    db: AsyncSession = Depends(get_db),
):
    items, total = await task_service.list_tasks(
        db,
        offset=offset,
        limit=limit,
        search=search,
        status=status_filter,
        priority=priority,
        customer_id=customer_id,
    )
    return PaginatedResponse(
        items=[TaskResponse.model_validate(t) for t in items],
        total=total,
        limit=limit,
        offset=offset,
        has_more=(offset + limit) < total,
    )


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Detail task berdasarkan ID",
)
async def get_task(task_id: int, db: AsyncSession = Depends(get_db)):
    task = await task_service.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task dengan ID {task_id} tidak ditemukan.",
        )
    return TaskResponse.model_validate(task)


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Buat task baru",
)
async def create_task(data: TaskCreate, db: AsyncSession = Depends(get_db)):
    try:
        task = await task_service.create_task(db, data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    return TaskResponse.model_validate(task)


@router.patch(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Update sebagian data task",
)
async def update_task(
    task_id: int, data: TaskUpdate, db: AsyncSession = Depends(get_db)
):
    task = await task_service.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task dengan ID {task_id} tidak ditemukan.",
        )
    try:
        updated = await task_service.update_task(db, task, data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    return TaskResponse.model_validate(updated)


@router.delete(
    "/{task_id}",
    response_model=MessageResponse,
    summary="Hapus task",
)
async def delete_task(task_id: int, db: AsyncSession = Depends(get_db)):
    task = await task_service.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task dengan ID {task_id} tidak ditemukan.",
        )
    await task_service.delete_task(db, task)
    return MessageResponse(
        message=f"Task '{task.title}' (ID: {task_id}) berhasil dihapus."
    )
