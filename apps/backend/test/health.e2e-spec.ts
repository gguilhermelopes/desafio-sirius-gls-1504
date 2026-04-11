import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request, { Response } from 'supertest';
import { AppModule } from '../src/app.module';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3001';
    process.env.FRONTEND_URL = 'http://localhost:3000';
    process.env.APP_VERSION = '0.0.0-test';

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
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
