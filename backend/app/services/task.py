"""CRUD service for Task entity."""

from typing import Optional, Sequence
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task, TaskStatus, TaskPriority
from app.schemas.task import TaskCreate, TaskUpdate


VALID_STATUSES = {s.value for s in TaskStatus}
VALID_PRIORITIES = {p.value for p in TaskPriority}


async def get_task(db: AsyncSession, task_id: int) -> Optional[Task]:
    """Fetch a single task by ID."""
    result = await db.execute(select(Task).where(Task.id == task_id))
    return result.scalar_one_or_none()


async def list_tasks(
    db: AsyncSession,
    *,
    offset: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    customer_id: Optional[int] = None,
) -> tuple[Sequence[Task], int]:
    """List tasks with optional filters. Returns (items, total)."""
    query = select(Task)
    count_query = select(func.count(Task.id))

    if search:
        pattern = f"%{search}%"
        filter_clause = Task.title.ilike(pattern)
        query = query.where(filter_clause)
        count_query = count_query.where(filter_clause)

    if status is not None:
        query = query.where(Task.status == status)
        count_query = count_query.where(Task.status == status)

    if priority is not None:
        query = query.where(Task.priority == priority)
        count_query = count_query.where(Task.priority == priority)

    if customer_id is not None:
        query = query.where(Task.customer_id == customer_id)
        count_query = count_query.where(Task.customer_id == customer_id)

    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    query = query.order_by(Task.id.desc()).offset(offset).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()

    return items, total


async def create_task(db: AsyncSession, data: TaskCreate) -> Task:
    """Create a new task with validation."""
    task_data = data.model_dump()

    if task_data.get("status") and task_data["status"] not in VALID_STATUSES:
        raise ValueError(f"Status tidak valid: {task_data['status']}. Pilihan: {VALID_STATUSES}")
    if task_data.get("priority") and task_data["priority"] not in VALID_PRIORITIES:
        raise ValueError(f"Prioritas tidak valid: {task_data['priority']}. Pilihan: {VALID_PRIORITIES}")

    task = Task(**task_data)
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


async def update_task(db: AsyncSession, task: Task, data: TaskUpdate) -> Task:
    """Update an existing task with partial data."""
    update_data = data.model_dump(exclude_unset=True)

    if "status" in update_data and update_data["status"] not in VALID_STATUSES:
        raise ValueError(f"Status tidak valid: {update_data['status']}. Pilihan: {VALID_STATUSES}")
    if "priority" in update_data and update_data["priority"] not in VALID_PRIORITIES:
        raise ValueError(f"Prioritas tidak valid: {update_data['priority']}. Pilihan: {VALID_PRIORITIES}")

    for field, value in update_data.items():
        setattr(task, field, value)
    await db.commit()
    await db.refresh(task)
    return task


async def delete_task(db: AsyncSession, task: Task) -> None:
    """Delete a task."""
    await db.delete(task)
    await db.commit()
