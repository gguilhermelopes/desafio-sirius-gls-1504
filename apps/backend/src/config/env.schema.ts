import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3101),
  FRONTEND_URL: z.string().default('http://localhost:3100'),
  APP_VERSION: z.string().default('0.0.0'),
  DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/juscash'),
  JWT_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(7),
  COOKIE_DOMAIN: z.string().default(''),
  COOKIE_SECURE: z.enum(['true', 'false']).default('false'),
  GEMINI_API_KEY: z.string().optional().transform((v) => v || undefined),
});

export type AppEnv = z.infer<typeof envSchema>;
