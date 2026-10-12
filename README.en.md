# J-CLEANING | Cleaning Estimate Portfolio

[한국어](README.md) · [English](README.en.md) · [日本語](README.ja.md)

> A personal portfolio project. Estimates are illustrative. Please use test data rather than real personal information.

### Overview

J-CLEANING is a portfolio web application for selecting a cleaning service, viewing an illustrative estimate, and requesting the estimate by email. It also includes customer accounts, manager authentication, public notices, and notice drafts.

### Features

- Move-in, move-out, residence, commercial, special, and partial cleaning options
- Example estimates based on space type and area
- Email delivery request for an estimate
- Customer registration, login, token refresh, and logout
- Manager notice creation, drafts, listing, and deletion
- Notice list/detail pages and a project photo gallery

### Tech stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: Python, FastAPI, Pydantic, SQLAlchemy
- Database: PostgreSQL
- Authentication: JWT access tokens and an HttpOnly refresh-token cookie

### Data flow

The browser sends requests to Next.js under `/api/*`. Next.js rewrites them to FastAPI. The API validates input, calculates estimates or reads/writes PostgreSQL data, and returns JSON. Estimate results are not persisted in the database.

### Run locally

1. Create a PostgreSQL database and run `db/schema.sql`, followed by `db/refresh_tokens.sql`.
2. Configure database, authentication, manager, and SMTP environment variables in `backend/config/.env`. Never commit the real `.env` file or secrets.
3. Install backend dependencies with `python -m pip install -r requirements.txt`.
4. Start the API from the `backend` directory:

```bash
python -m uvicorn main:app --reload --port 8000
```

5. Install frontend packages and set `BACKEND_URL=http://127.0.0.1:8000` in `frontend/.env.local`:

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`; FastAPI docs are at `http://127.0.0.1:8000/docs`.

### Deployment notes

- Set the Vercel Root Directory to `frontend` and configure `BACKEND_URL` with the deployed FastAPI URL.
- Set the Render Web Service Root Directory to `backend`, use `pip install -r requirements.txt` as the build command and `uvicorn main:app --host 0.0.0.0 --port $PORT` as the start command.
- Add Neon PostgreSQL connection details as Render environment variables. Keep `SESSION_SECRET`, manager password hashes, and SMTP credentials out of source control.
- Set `COOKIE_SECURE=true` in production and add the production frontend origin to FastAPI's CORS allowlist.
- Render free web services may sleep when idle. Render free services cannot connect directly to SMTP ports 25, 465, or 587; use a compatible email delivery method if email sending is needed on the free plan.
- Verify that the member-list frontend API paths match the backend routes before deployment.

### Demo account

No public demo account is included yet. Add only a dedicated test account after preparing one. Never publish real users' names, email addresses, phone numbers, birth dates, or passwords.
