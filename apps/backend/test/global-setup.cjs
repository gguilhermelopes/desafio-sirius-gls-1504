const { execSync } = require('node:child_process');
const path = require('node:path');

module.exports = async () => {
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
  process.env.PORT = process.env.PORT ?? '3001';
  process.env.FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  process.env.APP_VERSION = process.env.APP_VERSION ?? '0.0.0-test';
  process.env.JWT_SECRET =
    process.env.JWT_SECRET ?? '12345678901234567890123456789012';
  process.env.ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL ?? '15m';
  process.env.REFRESH_TOKEN_TTL_DAYS =
    process.env.REFRESH_TOKEN_TTL_DAYS ?? '7';
  process.env.COOKIE_DOMAIN = process.env.COOKIE_DOMAIN ?? '';
  process.env.COOKIE_SECURE = process.env.COOKIE_SECURE ?? 'false';
  process.env.POSTGRES_PORT = process.env.POSTGRES_PORT ?? '55432';
  process.env.DATABASE_URL =
    process.env.DATABASE_URL ??
    `postgresql://postgres:postgres@localhost:${process.env.POSTGRES_PORT}/juscash?schema=auth_e2e`;

  execSync('pnpm exec prisma migrate deploy', {
    cwd: path.resolve(__dirname, '..'),
    env: process.env,
    stdio: 'inherit',
  });
};
