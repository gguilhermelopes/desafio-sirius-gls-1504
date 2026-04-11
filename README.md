# Juscash Technical Case

## Project status

Initial foundation scaffold with backend health endpoint, frontend login shell, i18n baseline, and monorepo tooling.

## Local setup

Preferred path:

1. Copy `.env.example` to `.env`
2. Run `docker compose up --build`
3. Open `http://localhost:3000/login`

Optional app-only workflow:

1. Run `pnpm install`
2. Provide environment variables for the backend and frontend processes
3. Start the workspace with `pnpm dev`

## Docker

`docker compose up --build` starts the full development stack:

- PostgreSQL on `5432`
- NestJS in watch mode on `http://localhost:3001`
- Next.js in dev mode on `http://localhost:3000`

Useful commands:

- Start: `docker compose up --build`
- Stop: `docker compose down`
- Follow logs: `docker compose logs -f`
