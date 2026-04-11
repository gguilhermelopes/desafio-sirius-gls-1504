FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/frontend ./apps/frontend

RUN pnpm install --filter @juscash/frontend... --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "--filter", "@juscash/frontend", "dev", "--hostname", "0.0.0.0"]
