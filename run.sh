#!/usr/bin/env bash
set -euo pipefail

# Project slug (folder name) used to derive DB credentials
PROJECT_SLUG_RAW=$(basename "$PWD")
PROJECT_SLUG=$(echo "$PROJECT_SLUG_RAW" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9')

# Ensure .env exists and inject project-scoped DB credentials
if [ ! -f .env ]; then
  echo ".env not found. Creating from .env.example with project-scoped credentials"
  sed "s/{project_slug}/$PROJECT_SLUG/g" .env.example > .env
fi

# Build and start
docker compose up -d --build

echo "Waiting for MySQL to become healthy..."
DB_CID=$(docker compose ps -q db)
if [ -z "$DB_CID" ]; then
  echo "Database container not found" >&2
  exit 1
fi

for i in {1..60}; do
  STATUS=$(docker inspect -f '{{.State.Health.Status}}' "$DB_CID" || echo "unknown")
  if [ "$STATUS" = "healthy" ]; then
    echo "MySQL is healthy."
    break
  fi
  if [ "$STATUS" = "unhealthy" ]; then
    echo "MySQL reported unhealthy status" >&2
    docker compose logs db
    exit 1
  fi
  sleep 2
  if [ "$i" -eq 60 ]; then
    echo "Timed out waiting for MySQL health" >&2
    docker compose logs db
    exit 1
  fi
done

# Wait for backend to be ready and ensure schema is applied
echo "Waiting for backend to be ready..."
for i in {1..30}; do
  if docker compose exec backend sh -c "npx prisma db push --accept-data-loss" 2>/dev/null; then
    echo "Database schema applied successfully."
    break
  fi
  sleep 2
  if [ "$i" -eq 30 ]; then
    echo "Failed to apply database schema" >&2
    docker compose logs backend
    exit 1
  fi
done

# Now seed the database
echo "Seeding database with sample data..."
docker compose exec backend node prisma/seed.js || echo "Seeding failed or skipped"

echo "
News App is up!"
echo "API: http://localhost:4000"
echo "Frontend: http://localhost:5173"
echo "Health: curl http://localhost:4000/api/health"