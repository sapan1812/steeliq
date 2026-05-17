# SteelIQ — Industrial AI Platform

SteelIQ is a role-based industrial monitoring and analytics platform for steel manufacturing operations. It provides real-time dashboards, KPI tracking, and process insights for EAF (Electric Arc Furnace), CastX (Continuous Casting), and DRI (Direct Reduced Iron) production lines.

---

## Architecture

```
                        ┌─────────────────────────────────┐
                        │         steeliq-net (bridge)     │
                        │                                  │
  Browser               │  ┌─────────────────────────┐    │
    │                   │  │   frontend (nginx:80)    │    │
    │  HTTP :3000/:80   │  │   React + Vite SPA       │    │
    └──────────────────►│  │                          │    │
                        │  │  /api/* → proxy_pass     │    │
                        │  └────────────┬─────────────┘    │
                        │               │ HTTP :8000        │
                        │  ┌────────────▼─────────────┐    │
                        │  │   backend (FastAPI:8000)  │    │
                        │  │   Python / asyncpg        │    │
                        │  │   JWT auth · REST API     │    │
                        │  └────────────┬─────────────┘    │
                        │               │ TCP :5432         │
                        │  ┌────────────▼─────────────┐    │
                        │  │   db (PostgreSQL 16:5432) │    │
                        │  │   postgres:16-alpine      │    │
                        │  └──────────────────────────┘    │
                        └─────────────────────────────────┘
```

---

## Folder Structure

```
repo/
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── api/              # Route handlers
│   │   ├── core/             # Config, security (JWT)
│   │   ├── db/               # SQLAlchemy engine & session
│   │   ├── models/           # ORM models (User, Module, …)
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   └── services/         # Business logic layer
│   ├── alembic/              # Database migrations
│   │   └── versions/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                 # React 18 + Vite SPA
│   ├── src/
│   │   ├── api/              # Axios client & endpoint helpers
│   │   ├── assets/           # Static assets
│   │   ├── components/       # Shared UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Route-level page components
│   │   │   ├── admin/        # Admin panel pages
│   │   │   └── modules/      # EAF, CastX, DRI module pages
│   │   └── store/            # Zustand global state
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml        # Development stack
├── docker-compose.prod.yml   # Production overrides
├── .env.example              # Environment variable template
├── .dockerignore
└── README.md
```

---

## Quick Start — Development

> **Windows users:** Clone/copy the project to `D:\Project\steeliq`. Docker Desktop for Windows maps Windows paths automatically — `docker compose up` works from PowerShell or Windows Terminal in that directory.

```bash
# 1. Clone and enter the repo
git clone <repo-url> D:\Project\steeliq
cd D:\Project\steeliq

# 2. Create your local environment file
cp .env.example .env
# (No edits needed for local dev — defaults work out of the box)

# 3. Build and start all services
docker compose up --build

# 4. Open the app
#    Frontend:  http://localhost:3000
#    API docs:  http://localhost:8000/docs
#    ReDoc:     http://localhost:8000/redoc
```

On first boot the backend runs Alembic migrations automatically and seeds the database with demo users.

To stop all services:

```bash
docker compose down
# Add -v to also wipe the postgres_data volume (full reset)
docker compose down -v
```

---

## Production Deploy

```bash
# 1. Copy and fill in production secrets
cp .env.example .env
# Edit .env: set POSTGRES_PASSWORD, SECRET_KEY, CORS_ORIGINS, VITE_API_URL

# 2. Launch the production stack (merges both compose files)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# 3. Follow logs
docker compose logs -f
```

Key differences in production mode:
- PostgreSQL port **not** exposed to the host
- Backend runs with **4 Uvicorn workers** (no `--reload`)
- Frontend served on port **80**
- Source code **not** bind-mounted — uses the baked image
- Traefik labels pre-configured for TLS termination at `steeliq.zealogics.info`

---

## Demo Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Super Admin | `admin@emsteel.ae` | `Admin@123` | Full platform access + user/admin management |
| Plant Manager | `manager@emsteel.ae` | `Mgr@123` | All modules (CastX, EAF, DRI) + alerts |
| CastX Operator | `castx@emsteel.ae` | `CastX@123` | CastX module + alerts only |
| EAF Operator | `eaf@emsteel.ae` | `EAF@123` | EAF module + alerts only |
| DRI Operator | `dri@emsteel.ae` | `DRI@123` | DRI module + alerts only |

---

## API Endpoints Summary

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/auth/login` | Obtain access + refresh tokens | No |
| `POST` | `/auth/refresh` | Exchange refresh token for new access token | No |
| `POST` | `/auth/logout` | Invalidate refresh token | Yes |
| `GET` | `/auth/me` | Current user profile | Yes |
| `GET` | `/users/` | List all users | Admin |
| `POST` | `/users/` | Create user | Admin |
| `PATCH` | `/users/{id}` | Update user | Admin |
| `DELETE` | `/users/{id}` | Delete user | Admin |
| `GET` | `/modules/` | List available modules for current role | Yes |
| `GET` | `/modules/{slug}/kpis` | Module KPI data | Yes |
| `GET` | `/health` | Liveness / readiness probe | No |

Full interactive docs available at `/docs` (Swagger UI) and `/redoc`.

---

## Environment Variables

| Variable | Default (dev) | Description |
|----------|--------------|-------------|
| `POSTGRES_DB` | `steeliq` | PostgreSQL database name |
| `POSTGRES_USER` | `steeliq` | PostgreSQL username |
| `POSTGRES_PASSWORD` | `steeliq_dev_pass` | PostgreSQL password (**change in prod**) |
| `DATABASE_URL` | `postgresql+asyncpg://steeliq:steeliq_dev_pass@db:5432/steeliq` | Async SQLAlchemy connection string |
| `SECRET_KEY` | `dev-secret-key-…` | JWT signing secret (**must be 32+ chars, change in prod**) |
| `ALGORITHM` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `480` | Access token lifetime (8 hours) |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Refresh token lifetime |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated list of allowed CORS origins |
| `VITE_API_URL` | `http://localhost:8000` | Base URL the frontend uses for API calls |
| `ENVIRONMENT` | `development` | Runtime environment tag (`development` / `production`) |

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend framework | React | 18.x |
| Frontend build tool | Vite | 5.x |
| Frontend HTTP client | Axios | 1.x |
| Frontend state | Zustand | 5.x |
| Frontend charts | Recharts | 2.x |
| Frontend serving | nginx | alpine |
| Backend framework | FastAPI | 0.115 |
| Backend server | Uvicorn | 0.32 |
| ORM | SQLAlchemy (async) | 2.0 |
| Database driver | asyncpg | 0.30 |
| Migrations | Alembic | 1.14 |
| Auth | python-jose + passlib | — |
| Database | PostgreSQL | 16-alpine |
| Container runtime | Docker Compose | v2 |
