# Juscash Technical Case

## Project status

Initial foundation scaffold with backend health endpoint, frontend login shell, i18n baseline, and monorepo tooling.

## Local setup

Preferred path:

1. Copy `.env.example` to `.env`
2. Run `docker compose up --build`

Optional app-only workflow:

1. Run `pnpm install`
2. Provide environment variables for the backend and frontend processes
3. Start the workspace with `pnpm dev`

## Docker

Use `docker compose up --build` after copying `.env.example` to `.env`.
