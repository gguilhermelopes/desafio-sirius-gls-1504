import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CommunicationsModule } from '../communications/communications.module';
import { TribunalsModule } from '../tribunals/tribunals.module';
import { PjeApiClient } from './pje-api.client';
import { SyncService } from './sync.service';

@Module({
  imports: [ScheduleModule.forRoot(), CommunicationsModule, TribunalsModule],
  providers: [PjeApiClient, SyncService],
  exports: [SyncService],
})
export class SyncModule {}
