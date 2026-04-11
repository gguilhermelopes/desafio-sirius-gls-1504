import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(private readonly configService: ConfigService) {}

  getStatus() {
    return {
      status: 'ok',
      environment: this.configService.getOrThrow<string>('app.NODE_ENV'),
      version: this.configService.getOrThrow<string>('app.APP_VERSION'),
      timestamp: new Date().toISOString(),
    };
  }
}
