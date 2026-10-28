import os
import sys
from pathlib import Path
from fastapi import APIRouter, HTTPException
from backend.models import (
    HealthResponse,
    ConnectionTestRequest,
    ConnectionTestResponse,
    ConnectionSaveRequest,
)
from backend.database import check_database_connection, reset_engine
from backend.config import settings

router = APIRouter(prefix="/health", tags=["Health & Connectivity"])

@router.get("", response_model=HealthResponse)
def get_health():
    db_info = check_database_connection()
    return HealthResponse(
        status="healthy",
        service="FODS Enterprise Decision Support API",
        version="1.0.0",
        database=db_info,
    )

@router.get("/db")
def check_db():
    res = check_database_connection()
    if not res.get("connected"):
        return {
            "status": "disconnected",
            "message": "Database not connected",
            "details": res,
        }
    return {
        "status": "connected",
        "message": f"Successfully connected to Supabase PostgreSQL table 'public.sales_data' with {res.get('record_count')} records.",
        "details": res,
    }

config_router = APIRouter(prefix="/config", tags=["Configuration"])

@config_router.post("/test-connection", response_model=ConnectionTestResponse)
def test_connection_endpoint(req: ConnectionTestRequest):
    url = req.database_url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="Database URL cannot be empty.")
    
    # Run isolated connection check with custom URL
    res = check_database_connection(custom_url=url)
    return ConnectionTestResponse(
        success=bool(res.get("connected")),
        connected=bool(res.get("connected")),
        record_count=res.get("record_count"),
        expected_count=4574,
        is_exact_count_match=bool(res.get("is_exact_count_match")),
        date_range=res.get("date_range"),
        latency_ms=res.get("latency_ms"),
        error=res.get("error"),
    )

@config_router.post("/save-connection")
def save_connection_endpoint(req: ConnectionSaveRequest):
    url = req.database_url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="Database URL cannot be empty.")
    
    # Test first
    res = check_database_connection(custom_url=url)
    if not res.get("connected"):
        raise HTTPException(
            status_code=400,
            detail=f"Connection test failed: {res.get('error')}"
        )

    # Persist securely to root .env file
    root_env = Path(__file__).resolve().parent.parent.parent / ".env"
    
    existing_content = ""
    if root_env.exists():
        existing_content = root_env.read_text()
    
    lines = existing_content.splitlines()
    new_lines = []
    found = False
    for line in lines:
        if line.startswith("DATABASE_URL="):
            new_lines.append(f'DATABASE_URL="{url}"')
            found = True
        else:
            new_lines.append(line)
    
    if not found:
        new_lines.append(f'DATABASE_URL="{url}"')
    
    root_env.write_text("\n".join(new_lines) + "\n")
    os.environ["DATABASE_URL"] = url
    reset_engine(url)

    return {
        "success": True,
        "message": "Database connection saved and active.",
        "verification": res,
    }
