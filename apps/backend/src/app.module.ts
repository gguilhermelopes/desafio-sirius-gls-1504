import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import { envSchema } from './config/env.schema';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommunicationsModule } from './modules/communications/communications.module';
import { HealthModule } from './modules/health/health.module';
import { SummaryModule } from './modules/summary/summary.module';
import { SyncModule } from './modules/sync/sync.module';
import { TribunalsModule } from './modules/tribunals/tribunals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig],
      validate: (env) => envSchema.parse(env),
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          transport:
            configService.getOrThrow<string>('app.NODE_ENV') === 'development'
              ? { target: 'pino-pretty', options: { singleLine: true } }
              : undefined,
        },
      }),
    }),
    PrismaModule,
    AuthModule,
    HealthModule,
    TribunalsModule,
    CommunicationsModule,
    SummaryModule,
    SyncModule,
  ],
})
export class AppModule {}
