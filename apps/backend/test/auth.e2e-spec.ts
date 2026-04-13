import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { PrismaService } from '../src/infrastructure/database/prisma.service';

process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.APP_VERSION = '0.0.0-test';
process.env.JWT_SECRET = '12345678901234567890123456789012';
process.env.ACCESS_TOKEN_TTL = '15m';
process.env.REFRESH_TOKEN_TTL_DAYS = '7';
process.env.COOKIE_DOMAIN = '';
process.env.COOKIE_SECURE = 'false';

describe('Auth bootstrap (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let AppModule: typeof import('../src/app.module').AppModule;

  beforeAll(async () => {
    ({ AppModule } = await import('../src/app.module'));

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

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await request(httpServer)
        .post('/api/v1/auth/login')
        .send({
          email: `missing-${attempt}@juscash.com`,
          password: '12345678',
        });
    }

    const response = await request(httpServer).post('/api/v1/auth/login').send({
      email: 'missing-final@juscash.com',
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
});

function getSetCookieHeaders(
  setCookie: string | string[] | undefined,
): string[] {
  if (!setCookie) {
    return [];
  }

  return Array.isArray(setCookie) ? setCookie : [setCookie];
}
