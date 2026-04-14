import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SummaryModule } from '../summary/summary.module';
import { CommunicationsController } from './communications.controller';
import { CommunicationsRepository } from './communications.repository';
import { CommunicationsService } from './communications.service';

@Module({
  imports: [PrismaModule, AuthModule, SummaryModule],
  controllers: [CommunicationsController],
  providers: [CommunicationsRepository, CommunicationsService],
  exports: [CommunicationsRepository],
})
export class CommunicationsModule {}
