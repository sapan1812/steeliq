# ──────────────────────────────────────────────────────────────────────────────
# Stage 1: dependency builder
# ──────────────────────────────────────────────────────────────────────────────
FROM python:3.12-slim AS builder

# Build-time deps for psycopg2 and cryptography wheels
RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Copy and install Python dependencies into an isolated prefix
COPY requirements.txt .
RUN pip install --upgrade pip \
 && pip install --prefix=/install --no-cache-dir -r requirements.txt


# ──────────────────────────────────────────────────────────────────────────────
# Stage 2: runtime image
# ──────────────────────────────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

# Runtime lib only (no gcc)
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Non-root user
RUN addgroup --system steeliq && adduser --system --ingroup steeliq steeliq

WORKDIR /app

# Copy installed packages from builder stage
COPY --from=builder /install /usr/local

# Copy application source
COPY alembic.ini .
COPY alembic/ alembic/
COPY app/ app/

# Ensure the app is owned by the non-root user
RUN chown -R steeliq:steeliq /app

USER steeliq

EXPOSE 8000

# Run Alembic migrations then start the server.
# The CMD is a shell form so the && works correctly.
CMD alembic upgrade head && \
    uvicorn app.main:app \
        --host 0.0.0.0 \
        --port 8000 \
        --workers 2 \
        --loop uvloop \
        --http httptools \
        --access-log \
        --log-level info
