import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CommunicationsRepository } from '../communications/communications.repository';
import { TribunalsRepository } from '../tribunals/tribunals.repository';
import { PjeApiClient } from './pje-api.client';

const UPSERT_CONCURRENCY = 4;

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly pjeClient: PjeApiClient,
    private readonly communicationsRepository: CommunicationsRepository,
    private readonly tribunalsRepository: TribunalsRepository,
  ) {}

  @Cron('0 1 * * *')
  async dailySync() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const date = yesterday.toISOString().split('T')[0];

    this.logger.log(`Daily sync starting for date: ${date}`);
    await this.syncDate(date);
  }

  async syncDateRange(startDate: Date, endDate: Date, maxPagesPerDay?: number) {
    this.logger.log(`Syncing tribunals...`);
    await this.syncTribunals();

    const current = new Date(startDate);
    while (current <= endDate) {
      const date = current.toISOString().split('T')[0];
      await this.syncDate(date, maxPagesPerDay);
      current.setDate(current.getDate() + 1);
    }
  }

  async syncTribunals() {
    try {
      const tribunals = await this.pjeClient.fetchTribunals();
      await this.tribunalsRepository.upsertMany(
        tribunals.map((t) => ({ name: t.nome, sigla: t.sigla })),
      );
      this.logger.log(`Synced ${tribunals.length} tribunals`);
    } catch (error) {
      this.logger.error('Failed to sync tribunals', error);
    }
  }

  private async syncDate(date: string, maxPages = 200) {
    let recordsFetched = 0;
    let recordsSaved = 0;

    try {
      let page = 1;
      let hasMore = true;

      while (hasMore && page <= maxPages) {
        const result = await this.pjeClient.fetchCommunications({ date, page });

        if (result.items.length === 0) break;

        recordsFetched += result.items.length;

        for (let index = 0; index < result.items.length; index += UPSERT_CONCURRENCY) {
          const batch = result.items.slice(index, index + UPSERT_CONCURRENCY);
          const outcomes = await Promise.allSettled(
            batch.map((item) => this.upsertCommunication(item)),
          );

          outcomes.forEach((outcome, outcomeIndex) => {
            if (outcome.status === 'fulfilled') {
              recordsSaved++;
              return;
            }

            const item = batch[outcomeIndex];
            this.logger.error(
              `Failed to save communication ${item.id}`,
              outcome.reason,
            );
          });
        }

        this.logger.log(`Date ${date} page ${page}: ${result.items.length} items (total fetched: ${recordsFetched})`);
        page++;

        if (result.items.length < 5) {
          hasMore = false;
        }
      }

      await this.communicationsRepository.createSyncLog({
        status: 'SUCCESS',
        recordsFetched,
        recordsSaved,
        finishedAt: new Date(),
      });

      this.logger.log(`Sync complete for ${date}: ${recordsFetched} fetched, ${recordsSaved} saved`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Sync failed for ${date}: ${message}`);

      await this.communicationsRepository.createSyncLog({
        status: 'FAILED',
        recordsFetched,
        recordsSaved,
        errorMessage: message,
        finishedAt: new Date(),
      });
    }
  }

  private async upsertCommunication(item: any) {
    const recipients = [
      ...(item.destinatarios ?? []).map((d: any) => ({
        name: d.nome,
        type: 'PARTY' as const,
        role: d.polo,
        oabNumber: null,
        oabState: null,
      })),
      ...(item.destinatarioadvogados ?? []).map((d: any) => ({
        name: d.advogado.nome,
        type: 'LAWYER' as const,
        role: null,
        oabNumber: d.advogado.numero_oab,
        oabState: d.advogado.uf_oab,
      })),
    ];

    await this.communicationsRepository.upsertFromPje({
      pjeId: item.id,
      processNumber: item.numero_processo,
      className: item.nomeClasse,
      classCode: item.codigoClasse,
      tribunalSigla: item.siglaTribunal,
      publicationDate: new Date(item.data_disponibilizacao),
      type: item.tipoComunicacao,
      content: item.texto ?? '',
      organName: item.nomeOrgao,
      medium: item.meio,
      link: item.link,
      documentType: item.tipoDocumento,
      communicationNumber: item.numeroComunicacao,
      hash: item.hash,
      active: item.ativo,
      recipients,
    });
  }
}
