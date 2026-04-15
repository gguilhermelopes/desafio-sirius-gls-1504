import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { PrismaService } from '../../src/infrastructure/database/prisma.service';
import { getSetCookieHeaders, toCookieHeader } from '../helpers/cookies';

process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.APP_VERSION = '0.0.0-test';
process.env.JWT_SECRET = '12345678901234567890123456789012';
process.env.ACCESS_TOKEN_TTL = '15m';
process.env.REFRESH_TOKEN_TTL_DAYS = '7';
process.env.COOKIE_DOMAIN = '';
process.env.COOKIE_SECURE = 'false';
process.env.POSTGRES_PORT ??= '55432';
process.env.DATABASE_URL ??= `postgresql://postgres:postgres@localhost:${process.env.POSTGRES_PORT}/juscash?schema=auth_e2e`;

describe('Auth bootstrap (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let AppModule: typeof import('../../src/app.module').AppModule;

  beforeAll(async () => {
    ({ AppModule } = await import('../../src/app.module'));

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);
    app.setGlobalPrefix('api/v1');
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('persists a refresh session when registering', async () => {
    const uniqueEmail = `teste-${randomUUID()}@juscash.com`;
    const beforeCount = await prisma.refreshSession.count();
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    const response = await request(httpServer)
      .post('/api/v1/auth/register')
      .send({
        name: 'Usuário Teste',
        email: uniqueEmail,
        password: '12345678',
        passwordConfirmation: '12345678',
      });

    const body = response.body as { email: string; id: string; name: string };

    expect(response.status).toBe(201);
    expect(body.email).toBe(uniqueEmail);
    expect(body.id).toEqual(expect.any(String));
    expect(body.name).toBe('Usuário Teste');
    const cookieHeaders = getSetCookieHeaders(response.headers['set-cookie']);
    const accessCookie = cookieHeaders.find((cookie) =>
      cookie.startsWith('access_token='),
    );
    const refreshCookie = cookieHeaders.find((cookie) =>
      cookie.startsWith('refresh_token='),
    );

    expect(accessCookie).toEqual(expect.stringContaining('Max-Age=900'));
    expect(accessCookie).toEqual(expect.stringContaining('Expires='));
    expect(accessCookie).toEqual(expect.stringContaining('HttpOnly'));
    expect(accessCookie).toEqual(expect.stringContaining('Path=/'));
    expect(accessCookie).toEqual(expect.stringContaining('SameSite=Lax'));
    expect(refreshCookie).toEqual(expect.stringContaining('Max-Age=604800'));
    expect(refreshCookie).toEqual(expect.stringContaining('Expires='));
    expect(refreshCookie).toEqual(expect.stringContaining('HttpOnly'));
    expect(refreshCookie).toEqual(expect.stringContaining('Path=/'));
    expect(refreshCookie).toEqual(expect.stringContaining('SameSite=Lax'));

    const afterCount = await prisma.refreshSession.count();

    expect(afterCount).toBe(beforeCount + 1);
  });

  it('rejects duplicate emails with a controlled conflict', async () => {
    const uniqueEmail = `dup-${randomUUID()}@juscash.com`;
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    const firstResponse = await request(httpServer)
      .post('/api/v1/auth/register')
      .send({
        name: 'Primeiro Usuário',
        email: uniqueEmail.toUpperCase(),
        password: '12345678',
        passwordConfirmation: '12345678',
      });

    expect(firstResponse.status).toBe(201);

    const duplicateResponse = await request(httpServer)
      .post('/api/v1/auth/register')
      .send({
        name: 'Segundo Usuário',
        email: uniqueEmail,
        password: '12345678',
        passwordConfirmation: '12345678',
      });

    const duplicateBody = duplicateResponse.body as { message: string };

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateBody.message).toBe('Email already in use');
  });

  it('rejects a whitespace-only name on register', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    const response = await request(httpServer)
      .post('/api/v1/auth/register')
      .send({
        name: '   ',
        email: `invalid-name-${randomUUID()}@juscash.com`,
        password: '12345678',
        passwordConfirmation: '12345678',
      });

    const body = response.body as { message: string[] };

    expect(response.status).toBe(400);
    expect(body.message).toEqual(
      expect.arrayContaining([expect.stringContaining('name')]),
    );
  });

  it('rate limits repeated invalid login attempts', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];
    const email = `throttle-${randomUUID()}@juscash.com`;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await request(httpServer).post('/api/v1/auth/login').send({
        email,
        password: '12345678',
      });
    }

    const response = await request(httpServer).post('/api/v1/auth/login').send({
      email,
      password: '12345678',
    });

    expect(response.status).toBe(429);
  });

  it('logs in an existing user and sets auth cookies', async () => {
    const uniqueEmail = `joao-${randomUUID()}@juscash.com`;
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    const registerResponse = await request(httpServer)
      .post('/api/v1/auth/register')
      .send({
        name: 'João',
        email: uniqueEmail,
        password: '12345678',
        passwordConfirmation: '12345678',
      });

    expect(registerResponse.status).toBe(201);

    const response = await request(httpServer).post('/api/v1/auth/login').send({
      email: uniqueEmail.toUpperCase(),
      password: '12345678',
    });
    const body = response.body as { email: string; id: string; name: string };

    expect(response.status).toBe(201);
    expect(body.email).toBe(uniqueEmail);
    expect(body.id).toEqual(expect.any(String));
    expect(body.name).toBe('João');
    const cookieHeaders = getSetCookieHeaders(response.headers['set-cookie']);
    const accessCookie = cookieHeaders.find((cookie) =>
      cookie.startsWith('access_token='),
    );
    const refreshCookie = cookieHeaders.find((cookie) =>
      cookie.startsWith('refresh_token='),
    );

    expect(accessCookie).toEqual(expect.stringContaining('Max-Age=900'));
    expect(accessCookie).toEqual(expect.stringContaining('Expires='));
    expect(refreshCookie).toEqual(expect.stringContaining('Max-Age=604800'));
    expect(refreshCookie).toEqual(expect.stringContaining('Expires='));
  });

  it('returns 401 for an existing-shape login payload with a short wrong password', async () => {
    const uniqueEmail = `short-login-${randomUUID()}@juscash.com`;
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    const registerResponse = await request(httpServer)
      .post('/api/v1/auth/register')
      .send({
        name: 'Usuário Short Login',
        email: uniqueEmail,
        password: '12345678',
        passwordConfirmation: '12345678',
      });

    expect(registerResponse.status).toBe(201);

    const response = await request(httpServer).post('/api/v1/auth/login').send({
      email: uniqueEmail,
      password: '123',
    });

    const body = response.body as { message: string };

    expect(response.status).toBe(401);
    expect(body.message).toBe('Invalid credentials');
  });

  it('still returns 400 for malformed login payload shape', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    const response = await request(httpServer).post('/api/v1/auth/login').send({
      email: 'not-an-email',
      password: 123,
    });

    const body = response.body as { message: string[] };

    expect(response.status).toBe(400);
    expect(body.message).toEqual(
      expect.arrayContaining([
        expect.stringContaining('email'),
        expect.stringContaining('password'),
      ]),
    );
  });

  it('returns the authenticated user on /auth/me', async () => {
    const uniqueEmail = `me-${randomUUID()}@juscash.com`;
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    const registerResponse = await request(httpServer)
      .post('/api/v1/auth/register')
      .send({
        name: 'Usuário Me',
        email: uniqueEmail,
        password: '12345678',
        passwordConfirmation: '12345678',
      });

    expect(registerResponse.status).toBe(201);

    const response = await request(httpServer)
      .get('/api/v1/auth/me')
      .set(
        'Cookie',
        toCookieHeader(
          getSetCookieHeaders(registerResponse.headers['set-cookie']),
        ),
      );

    const body = response.body as { email: string; id: string; name: string };

    expect(response.status).toBe(200);
    expect(body.email).toBe(uniqueEmail);
    expect(body.id).toEqual(expect.any(String));
    expect(body.name).toBe('Usuário Me');
  });

  it('refreshes the session using refresh_token cookie', async () => {
    const uniqueEmail = `refresh-${randomUUID()}@juscash.com`;
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    const registerResponse = await request(httpServer)
      .post('/api/v1/auth/register')
      .send({
        name: 'Usuário Refresh',
        email: uniqueEmail,
        password: '12345678',
        passwordConfirmation: '12345678',
      });

    expect(registerResponse.status).toBe(201);

    const response = await request(httpServer)
      .post('/api/v1/auth/refresh')
      .set(
        'Cookie',
        toCookieHeader(
          getSetCookieHeaders(registerResponse.headers['set-cookie']),
        ),
      );

    const body = response.body as { email: string; id: string; name: string };

    expect(response.status).toBe(201);
    expect(body.email).toBe(uniqueEmail);
    expect(body.id).toEqual(expect.any(String));
    expect(body.name).toBe('Usuário Refresh');
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('access_token=')]),
    );
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('refresh_token=')]),
    );
  });

  it('rejects a revoked refresh token after rotation', async () => {
    const uniqueEmail = `rotate-${randomUUID()}@juscash.com`;
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    const registerResponse = await request(httpServer)
      .post('/api/v1/auth/register')
      .send({
        name: 'Usuário Rotate',
        email: uniqueEmail,
        password: '12345678',
        passwordConfirmation: '12345678',
      });

    expect(registerResponse.status).toBe(201);

    const firstRefresh = await request(httpServer)
      .post('/api/v1/auth/refresh')
      .set(
        'Cookie',
        toCookieHeader(
          getSetCookieHeaders(registerResponse.headers['set-cookie']),
        ),
      );

    expect(firstRefresh.status).toBe(201);

    const secondRefresh = await request(httpServer)
      .post('/api/v1/auth/refresh')
      .set(
        'Cookie',
        toCookieHeader(
          getSetCookieHeaders(registerResponse.headers['set-cookie']),
        ),
      );

    expect(secondRefresh.status).toBe(401);
  });

  it('allows only one concurrent refresh rotation per token', async () => {
    const uniqueEmail = `parallel-${randomUUID()}@juscash.com`;
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    const registerResponse = await request(httpServer)
      .post('/api/v1/auth/register')
      .send({
        name: 'Usuário Parallel',
        email: uniqueEmail,
        password: '12345678',
        passwordConfirmation: '12345678',
      });

    expect(registerResponse.status).toBe(201);

    const cookieHeader = toCookieHeader(
      getSetCookieHeaders(registerResponse.headers['set-cookie']),
    );

    const [firstRefresh, secondRefresh] = await Promise.all([
      request(httpServer)
        .post('/api/v1/auth/refresh')
        .set('Cookie', cookieHeader),
      request(httpServer)
        .post('/api/v1/auth/refresh')
        .set('Cookie', cookieHeader),
    ]);

    expect(
      [firstRefresh.status, secondRefresh.status].sort(
        (left, right) => left - right,
      ),
    ).toEqual([201, 401]);
  });

  it('logs out and clears cookies', async () => {
    const uniqueEmail = `logout-${randomUUID()}@juscash.com`;
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    const registerResponse = await request(httpServer)
      .post('/api/v1/auth/register')
      .send({
        name: 'Usuário Logout',
        email: uniqueEmail,
        password: '12345678',
        passwordConfirmation: '12345678',
      });

    expect(registerResponse.status).toBe(201);

    const response = await request(httpServer)
      .post('/api/v1/auth/logout')
      .set(
        'Cookie',
        toCookieHeader(
          getSetCookieHeaders(registerResponse.headers['set-cookie']),
        ),
      );

    expect(response.status).toBe(201);
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('access_token=;')]),
    );
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('refresh_token=;')]),
    );
  });
});
