from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, customers, products, invoices, tasks, auth, ai
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown procedures."""
    # Startup: logging initialization or connection check can be done here
    yield
    # Shutdown: cleanup connection pools if needed


def create_application() -> FastAPI:
    """Application factory for DailyDose AI Backend."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="Backend API untuk DailyDose AI dengan FastAPI dan PostgreSQL.",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # CORS configuration (allowing local dev & cloud deployments on Render / Vercel)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ],
        allow_origin_regex=r"https://.*\.onrender\.com|https://.*\.vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routes
    app.include_router(health.router)
    app.include_router(customers.router)
    app.include_router(products.router)
    app.include_router(invoices.router)
    app.include_router(tasks.router)
    app.include_router(auth.router)
    app.include_router(ai.router)

    @app.get("/", tags=["Root"], summary="Root endpoint")
    async def root():
        return {
            "app": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "running",
            "docs": "/docs",
            "health": "/health",
        }

    return app


app = create_application()
