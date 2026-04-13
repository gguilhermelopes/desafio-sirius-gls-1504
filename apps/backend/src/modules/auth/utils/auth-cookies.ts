import { Response } from 'express';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../auth.constants';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

type AuthCookieOptions = {
  accessTokenTtl: string;
  domain?: string;
  refreshTokenTtlDays: number;
  secure: boolean;
};

export function setAuthCookies(
  response: Response,
  accessToken: string,
  refreshToken: string,
  options: AuthCookieOptions,
) {
  const accessTokenMaxAgeMs = parseDurationToMs(options.accessTokenTtl);
  const refreshTokenMaxAgeMs = options.refreshTokenTtlDays * MS_PER_DAY;
  const baseCookieOptions = {
    domain: options.domain || undefined,
    httpOnly: true,
    path: '/',
    sameSite: 'lax' as const,
    secure: options.secure,
  };

  response.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    ...baseCookieOptions,
    expires: new Date(Date.now() + accessTokenMaxAgeMs),
    maxAge: accessTokenMaxAgeMs,
  });
  response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    ...baseCookieOptions,
    expires: new Date(Date.now() + refreshTokenMaxAgeMs),
    maxAge: refreshTokenMaxAgeMs,
  });
}

function parseDurationToMs(duration: string): number {
  const match = duration.match(/^(\d+)(ms|s|m|h|d)$/);

  if (!match) {
    const numericDuration = Number(duration);

    if (!Number.isFinite(numericDuration)) {
      throw new Error(`Invalid duration: ${duration}`);
    }

    return numericDuration;
  }

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 'ms':
      return value;
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * MS_PER_DAY;
    default:
      return value;
  }
}
