import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET!,
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL ?? '15m',
  refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? '7'),
  cookieDomain: process.env.COOKIE_DOMAIN ?? '',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
}));
