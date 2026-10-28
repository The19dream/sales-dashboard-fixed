# Deploy Sales Dashboard on Render

This project has a React/Vite frontend and a separate FastAPI backend. Deploy them as two Render services.

## 1. Backend Web Service
- Repository: `The19dream/sales-dashboard`
- Runtime: Python 3
- Root Directory: leave blank (repository root; imports use `backend.*`)
- Build Command: `pip install -r backend/requirements.txt`
- Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- Environment: `DATABASE_URL` = your Supabase PostgreSQL URI (keep private); optionally `GEMINI_API_KEY`.
- After creating the frontend Static Site, set `CORS_ORIGINS` to its full origin, e.g. `https://your-site.onrender.com` (no trailing slash).

The backend health endpoint is `/api/health`; API docs are `/api/docs`.

## 2. Frontend Static Site
- Repository: `The19dream/sales-dashboard`
- Build Command: `npm install --include=dev && npm run build`
- Publish Directory: `dist`
- Environment variable: `VITE_API_BASE_URL` = `https://YOUR-BACKEND-SERVICE.onrender.com/api` (replace with the actual backend URL, including `/api`).

The app uses `/api` by default for local development; in production the environment variable directs it to the deployed backend. Vite's proxy only works during local development.

## 3. Supabase
Set `DATABASE_URL` only on the backend service. Never set it as a `VITE_` variable, because Vite variables are included in browser code. The backend expects the existing `public.sales_data` table with the columns used by the analytics queries.

## 4. Local development
Run FastAPI from the repository root on port 8001: `python -m uvicorn backend.main:app --host 0.0.0.0 --port 8001`. In another terminal run `npm install` then `npm run dev`.
