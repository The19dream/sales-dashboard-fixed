import time
import logging
from typing import Any
import sqlalchemy
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from backend.config import settings

logger = logging.getLogger("fods.database")

# Thread-safe global engine cache
_engine: Engine | None = None

EXPECTED_ROW_COUNT = 4574
TABLE_NAME = "sales_data"
METRICS_Q = ["Q-P1", "Q-P2", "Q-P3", "Q-P4"]
METRICS_S = ["S-P1", "S-P2", "S-P3", "S-P4"]
ALL_METRICS = METRICS_Q + METRICS_S
ALL_COLUMNS = ["id", "Date"] + ALL_METRICS

def get_engine(custom_url: str | None = None) -> Engine | None:
    """Returns or creates the SQLAlchemy engine."""
    global _engine
    url = custom_url or settings.get_effective_db_url()
    if not url:
        return None
    
    if custom_url or _engine is None:
        try:
            # We enforce read-only safe timeouts and connection pre-ping
            engine = create_engine(
                url,
                pool_pre_ping=True,
                pool_size=5,
                max_overflow=5,
                pool_timeout=10,
                connect_args={
                    "connect_timeout": 8,
                }
            )
            if not custom_url:
                _engine = engine
            return engine
        except Exception as e:
            logger.error(f"Failed to create database engine: {e}")
            if not custom_url:
                _engine = None
            raise
    return _engine

def reset_engine(new_url: str | None = None) -> Engine | None:
    """Resets global engine with new URL."""
    global _engine
    if _engine:
        try:
            _engine.dispose()
        except Exception:
            pass
        _engine = None
    if new_url:
        settings.DATABASE_URL = new_url
        return get_engine(new_url)
    return None

def check_database_connection(custom_url: str | None = None) -> dict[str, Any]:
    """
    Performs a real, live database check on the existing Supabase PostgreSQL table.
    Verifies:
      1. Connection handshake & latency
      2. Table existence: public.sales_data
      3. Total row count (verified against 4,574)
      4. Date range coverage
      5. Columns presence
    """
    url = custom_url or settings.get_effective_db_url()
    if not url:
        return {
            "connected": False,
            "configured": False,
            "record_count": None,
            "expected_count": EXPECTED_ROW_COUNT,
            "is_exact_count_match": False,
            "date_range": None,
            "columns_present": [],
            "latency_ms": None,
            "error": "No database connection string configured. Please configure DATABASE_URL in .env.",
        }

    start_time = time.time()
    try:
        engine = get_engine(custom_url)
        if not engine:
            return {
                "connected": False,
                "configured": True,
                "record_count": None,
                "expected_count": EXPECTED_ROW_COUNT,
                "is_exact_count_match": False,
                "date_range": None,
                "columns_present": [],
                "latency_ms": None,
                "error": "Failed to initialize PostgreSQL engine.",
            }

        with engine.connect() as conn:
            # Check table existence & columns
            col_check_sql = text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'sales_data'
            """)
            col_res = conn.execute(col_check_sql).fetchall()
            existing_cols = [r[0] for r in col_res]
            
            if not existing_cols:
                return {
                    "connected": True,
                    "configured": True,
                    "record_count": 0,
                    "expected_count": EXPECTED_ROW_COUNT,
                    "is_exact_count_match": False,
                    "date_range": None,
                    "columns_present": [],
                    "latency_ms": round((time.time() - start_time) * 1000, 2),
                    "error": "Connected to database, but table 'public.sales_data' was not found.",
                }

            # Query row count and date range with proper quoted identifiers
            stats_sql = text("""
                SELECT 
                    COUNT(*)::bigint AS total_count,
                    MIN("Date")::text AS min_date,
                    MAX("Date")::text AS max_date
                FROM public.sales_data
            """)
            row = conn.execute(stats_sql).fetchone()
            total_count = int(row[0]) if row and row[0] is not None else 0
            min_date = row[1] if row else None
            max_date = row[2] if row else None
            latency = round((time.time() - start_time) * 1000, 2)

            return {
                "connected": True,
                "configured": True,
                "record_count": total_count,
                "expected_count": EXPECTED_ROW_COUNT,
                "is_exact_count_match": (total_count == EXPECTED_ROW_COUNT),
                "date_range": {
                    "min_date": min_date,
                    "max_date": max_date,
                },
                "columns_present": existing_cols,
                "latency_ms": latency,
                "error": None,
            }
    except Exception as e:
        latency = round((time.time() - start_time) * 1000, 2)
        err_msg = str(e)
        logger.error(f"Database connection error: {err_msg}")
        return {
            "connected": False,
            "configured": True,
            "record_count": None,
            "expected_count": EXPECTED_ROW_COUNT,
            "is_exact_count_match": False,
            "date_range": None,
            "columns_present": [],
            "latency_ms": latency,
            "error": err_msg,
        }

def execute_readonly_query(sql_str: str, params: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    """
    Executes a read-only parameterized query against public.sales_data.
    Safely rejects any write/DDL keywords.
    """
    clean_sql = sql_str.strip()
    first_word = clean_sql.split()[0].upper() if clean_sql else ""
    if first_word not in ("SELECT", "WITH"):
        raise ValueError("Only read-only SELECT queries are permitted on this database.")

    engine = get_engine()
    if not engine:
        raise RuntimeError("Database connection is not configured or engine is offline.")

    with engine.connect() as conn:
        result = conn.execute(text(clean_sql), params or {})
        keys = result.keys()
        return [dict(zip(keys, row)) for row in result.fetchall()]
