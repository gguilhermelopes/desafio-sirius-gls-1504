import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AppModule } = require('../src/app.module') as typeof import('../src/app.module');

describe('Auth bootstrap (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
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
    const beforeCount = await prisma.refreshSession.count();

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        name: 'Usuário Teste',
        email: 'teste@juscash.com',
        password: '12345678',
        passwordConfirmation: '12345678',
      });

    expect(response.status).toBe(201);

    const afterCount = await prisma.refreshSession.count();

    expect(afterCount).toBe(beforeCount + 1);
  });
});
