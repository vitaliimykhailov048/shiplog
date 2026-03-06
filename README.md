# shiplog

Small shipment tracking dashboard. Add parcels, update their status, filter by state, see basic stats.

## Stack

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind
- **Backend**: FastAPI + SQLAlchemy + Alembic
- **DB**: PostgreSQL
- **Auth**: JWT (OAuth2 password flow)
- **Infra**: Docker + docker-compose, GitHub Actions CI

## Screenshots

_TODO: add screenshots of the dashboard, new-shipment form, and login._

## Run it

```bash
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

First time: open the app, click "No account? Register", create a user, start adding shipments.

## Local dev (without docker)

```bash
# backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=postgresql+psycopg2://shiplog:shiplog@localhost:5432/shiplog
alembic upgrade head
uvicorn app.main:app --reload

# frontend
cd frontend
npm install
npm run dev
```

## Tests

```bash
cd backend && pytest -q
```

Tests run against an in-memory SQLite via dependency overrides, so no Postgres needed.

## API

| Method | Path | Notes |
|---|---|---|
| `POST` | `/api/auth/register` | `{email, password}` → token |
| `POST` | `/api/auth/login` | form (`username`, `password`) → token |
| `GET`  | `/api/auth/me` | current user |
| `GET`  | `/api/shipments` | `?status=&q=` |
| `GET`  | `/api/shipments/stats` | totals per status |
| `POST` | `/api/shipments` | create |
| `GET`  | `/api/shipments/{id}` | fetch one |
| `PATCH`| `/api/shipments/{id}` | partial update |
| `DELETE` | `/api/shipments/{id}` | delete |
| `GET`  | `/api/health` | liveness |

Auth header: `Authorization: Bearer <token>`. Shipments are scoped per user.

Statuses: `pending`, `in_transit`, `delivered`, `cancelled`.

## Layout

```
backend/   FastAPI app, SQLAlchemy models, alembic migrations, pytest
frontend/  Next.js app, components, API client
```

## License

MIT
