# FODS Enterprise Decision Support Backend (FastAPI)

Enterprise-grade Python FastAPI backend for the Foundation of Data Science (FODS) Decision Support Dashboard.
Provides high-performance, read-only analytics, parameterized aggregations, descriptive statistics, IQR outlier detection, and Supabase PostgreSQL integration.

---

## 1. Quick Start (Local Development)

### Prerequisites
- Python 3.10+ installed
- PostgreSQL connection string for your Supabase database

### Step 1: Set up Virtual Environment
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` (or configure in root `.env`):
```bash
cp .env.example .env
```

Edit `.env` and set your Supabase database URL:
```env
# Supabase Transaction Pooler URI (Recommended) or Direct Session URI:
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[YOUR-REGION].pooler.supabase.com:6543/postgres?sslmode=require"

# FastAPI Port:
FASTAPI_PORT=8001

# Optional: Gemini API Key for AI decision insights
GEMINI_API_KEY="your_gemini_api_key"
```

### Step 3: Run the FastAPI Service
```bash
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8001 --reload
```

Interactive Swagger documentation will be available at:
`http://localhost:8001/api/docs`

---

## 2. Supabase Database Configuration & Security

1. In your **Supabase Dashboard**:
   - Go to **Project Settings** -> **Database**
   - Under **Connection string**, select **URI**
   - Choose **Transaction pooler** (Port `6543`) for serverless/containerized deployments or **Session pooler** / **Direct** (`5432`).
2. Table Verification:
   - Schema: `public.sales_data`
   - Target Records: `4,574`
   - Columns: `"id"`, `"Date"`, `"Q-P1"`, `"Q-P2"`, `"Q-P3"`, `"Q-P4"`, `"S-P1"`, `"S-P2"`, `"S-P3"`, `"S-P4"`
   - Hyphenated identifiers and case sensitivity are safely handled in SQL with double quotes.
3. Read-Only Least Privilege Role (Best Practice):
   ```sql
   -- Optional dedicated read-only role:
   CREATE ROLE fods_readonly WITH LOGIN PASSWORD 'secure_readonly_password';
   GRANT USAGE ON SCHEMA public TO fods_readonly;
   GRANT SELECT ON public.sales_data TO fods_readonly;
   ```

---

## 3. API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Service health status and database connection info |
| `GET` | `/api/health/db` | Live deep check of `public.sales_data` (verifies 4,574 rows) |
| `POST` | `/api/config/test-connection` | Test Supabase PostgreSQL connection string |
| `POST` | `/api/config/save-connection` | Save and activate connection string |
| `GET` | `/api/analytics/overview` | Total records, date span, total Q & S metrics |
| `GET` | `/api/analytics/time-series` | Aggregated metrics (daily, weekly, monthly, yearly) |
| `GET` | `/api/analytics/yearly` | Yearly sums, averages, and YoY growth percentages |
| `GET` | `/api/analytics/comparisons` | Product share comparison and Pearson correlation matrix |
| `GET` | `/api/analytics/statistics` | Descriptive statistics (min, max, mean, median, stddev, IQR) |
| `GET` | `/api/analytics/outliers` | IQR-based outlier detection with educational guidelines |
| `GET` | `/api/analytics/records` | Paginated, searchable, sorted sales data |
| `GET` | `/api/analytics/export` | CSV export with date range and search filtering |
| `GET` | `/api/analytics/data-quality` | Missing values, null checks, and date sequence continuity |
| `POST` | `/api/ai/insights` | Statistical decision-support synthesis using Gemini API |

---

## 4. Production Deployment

### Option A: Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8001
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

### Option B: Render / Railway / Fly.io
- Build Command: `pip install -r backend/requirements.txt`
- Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- Set Environment Variable: `DATABASE_URL` in the cloud provider's dashboard.
