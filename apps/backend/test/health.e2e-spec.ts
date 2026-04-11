import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request, { Response } from 'supertest';

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

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('returns health metadata', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    await request(httpServer)
      .get('/api/v1/health')
      .expect(200)
      .expect((response: Response) => {
        const body = response.body as {
          environment: string;
          status: string;
          timestamp: string;
          version: string;
        };

        expect(body).toMatchObject({
          status: 'ok',
          environment: 'test',
          version: '0.0.0-test',
        });
        expect(typeof body.timestamp).toBe('string');
      });
  });
});
