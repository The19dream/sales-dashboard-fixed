import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.config import settings
from backend.database import check_database_connection
from backend.routers.health import router as health_router, config_router
from backend.routers.analytics import router as analytics_router
from backend.routers.ai import router as ai_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("fods.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing FODS Decision Support Backend Service...")
    # Check DB on startup
    status = check_database_connection()
    if status.get("connected"):
        logger.info(f"Database connected! Found {status.get('record_count')} records in public.sales_data.")
    else:
        logger.warning(f"Database not connected on startup: {status.get('error')}")
    yield
    logger.info("Shutting down FODS Decision Support Backend Service...")

app = FastAPI(
    title="FODS Enterprise Decision Support API",
    description="Backend analytics engine for Foundation of Data Science decision-support dashboard, connected to Supabase PostgreSQL.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.environ.get("CORS_ORIGINS", "*").split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers under /api
app.include_router(health_router, prefix="/api")
app.include_router(config_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(ai_router, prefix="/api")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Internal server error occurred while processing analytics query.",
            "detail": str(exc),
            "path": request.url.path,
        }
    )

@app.get("/")
def root():
    return {
        "service": "FODS Enterprise Decision Support API",
        "status": "running",
        "docs": "/api/docs",
        "health": "/api/health",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=False)
