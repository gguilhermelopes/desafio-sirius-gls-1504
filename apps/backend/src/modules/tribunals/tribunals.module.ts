import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { TribunalsController } from './tribunals.controller';
import { TribunalsRepository } from './tribunals.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TribunalsController],
  providers: [TribunalsRepository],
  exports: [TribunalsRepository],
})
export class TribunalsModule {}
