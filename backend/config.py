import os
from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load from backend/.env or root .env
root_dir = Path(__file__).resolve().parent.parent
load_dotenv(root_dir / ".env")
load_dotenv(Path(__file__).resolve().parent / ".env")

class Settings(BaseSettings):
    DATABASE_URL: str | None = None
    SUPABASE_DB_HOST: str | None = None
    SUPABASE_DB_PORT: int = 5432
    SUPABASE_DB_NAME: str = "postgres"
    SUPABASE_DB_USER: str = "postgres"
    SUPABASE_DB_PASSWORD: str | None = None
    SUPABASE_DB_SSLMODE: str = "require"
    
    # Gemini AI configuration
    GEMINI_API_KEY: str | None = None
    
    # Server runtime
    PORT: int = int(os.environ.get("FASTAPI_PORT", 8001))
    HOST: str = "0.0.0.0"
    CORS_ORIGINS: list[str] = [origin.strip() for origin in os.environ.get("CORS_ORIGINS", "*").split(",") if origin.strip()]

    def get_effective_db_url(self) -> str | None:
        """Returns the PostgreSQL connection string, resolving either DATABASE_URL or individual credentials."""
        url = self.DATABASE_URL or os.environ.get("DATABASE_URL")
        if url:
            # Fix postgres:// legacy URI scheme if present
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql://", 1)
            # Ensure sslmode=require for Supabase if not explicitly disabled
            if "sslmode=" not in url and ("supabase.co" in url or "supabase.com" in url):
                sep = "&" if "?" in url else "?"
                url = f"{url}{sep}sslmode=require"
            return url
        
        host = self.SUPABASE_DB_HOST or os.environ.get("SUPABASE_DB_HOST")
        password = self.SUPABASE_DB_PASSWORD or os.environ.get("SUPABASE_DB_PASSWORD")
        if host and password:
            port = self.SUPABASE_DB_PORT or os.environ.get("SUPABASE_DB_PORT", 5432)
            user = self.SUPABASE_DB_USER or os.environ.get("SUPABASE_DB_USER", "postgres")
            name = self.SUPABASE_DB_NAME or os.environ.get("SUPABASE_DB_NAME", "postgres")
            sslmode = self.SUPABASE_DB_SSLMODE or "require"
            return f"postgresql://{user}:{password}@{host}:{port}/{name}?sslmode={sslmode}"
        
        return None

settings = Settings()
