FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl
RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/backend ./apps/backend

RUN pnpm install --filter @juscash/backend... --frozen-lockfile

EXPOSE 3001

CMD ["pnpm", "--filter", "@juscash/backend", "dev"]
