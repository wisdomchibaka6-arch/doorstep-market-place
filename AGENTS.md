# Doorstep Market Place — Base44 Dev Environment

## Overview

A neighborhood marketplace mobile app built with Expo (React Native), structured as a pnpm workspace monorepo (originally a Replit project).

## Running the app

```bash
docker compose -f docker-compose.base44.yml up -d
```

The Expo app runs in **web mode** on port 3000. The dev server (Metro) live-reloads on source changes.

## Workspace structure

- `artifacts/doorstep-market` — Main Expo app (React Native + expo-router). Entry: `expo-router/entry`. Routes in `app/`. Uses AsyncStorage for local state; does NOT call the API server.
- `artifacts/api-server` — Express 5 API (port 5000). Currently only has a `/api/healthz` endpoint. Requires `DATABASE_URL` and `PORT`.
- `artifacts/mockup-sandbox` — Vite component preview tool (Replit design canvas). Not the main app.
- `lib/db` — Drizzle ORM + PostgreSQL. Schema is currently empty (no tables defined).
- `lib/api-client-react` — Generated React Query hooks (Orval codegen).
- `lib/api-zod` — Generated Zod schemas.
- `lib/api-spec` — OpenAPI spec + Orval config.

## Key details

- **pnpm 10+ required** — `pnpm-workspace.yaml` uses `minimumReleaseAge` (a pnpm 10 feature). The lockfile is version 9.0.
- The Expo app is self-contained: it uses AsyncStorage for product/shop data and does not import `@workspace/api-client-react` or `@workspace/db`.
- The DB schema is empty and the API server only has a health check — neither is needed for the app to run.
- `minimumReleaseAge: 1440` enforces a 1-day minimum package age for supply-chain safety. Do not disable.
- Node 22+ required (Replit used Node 24).

## Useful commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000, needs DATABASE_URL)
- `pnpm --filter @workspace/db run push` — push DB schema changes (needs DATABASE_URL)
