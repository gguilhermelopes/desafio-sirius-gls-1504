FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/backend ./apps/backend

RUN pnpm install --filter @juscash/backend... --frozen-lockfile
RUN pnpm --filter @juscash/backend prisma:generate
RUN pnpm --filter @juscash/backend build

EXPOSE 3001

CMD ["pnpm", "--filter", "@juscash/backend", "start"]
