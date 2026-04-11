import { registerAs } from '@nestjs/config';
import { envSchema } from './env.schema';

export default registerAs('auth', () => {
  const env = envSchema.parse(process.env);

  return {
    jwtSecret: env.JWT_SECRET,
    accessTokenTtl: env.ACCESS_TOKEN_TTL,
    refreshTokenTtlDays: env.REFRESH_TOKEN_TTL_DAYS,
    cookieDomain: env.COOKIE_DOMAIN,
    cookieSecure: env.COOKIE_SECURE === 'true',
  };
});
