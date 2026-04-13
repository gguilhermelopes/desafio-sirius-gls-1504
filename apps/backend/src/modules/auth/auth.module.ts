import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './repositories/auth.repository';

@Module({
  imports: [
    PrismaModule,
    ThrottlerModule.forRoot([
      {
        limit: 5,
        ttl: 60_000,
      },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('auth.jwtSecret'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, ThrottlerGuard],
  exports: [AuthService],
})
export class AuthModule {}
