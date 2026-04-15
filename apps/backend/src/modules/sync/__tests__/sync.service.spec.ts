import { SyncService } from '../sync.service';

describe('SyncService', () => {
  describe('syncDate', () => {
    it('should process communication upserts with limited concurrency and preserve sync counts', async () => {
      const items = Array.from({ length: 6 }, (_, index) => ({
        id: index + 1,
        numero_processo: `000${index}`,
        nomeClasse: 'Classe',
        codigoClasse: '001',
        siglaTribunal: 'TJSP',
        data_disponibilizacao: '2026-04-14T00:00:00.000Z',
        tipoComunicacao: 'DESPACHO',
        texto: `Conteudo ${index}`,
        nomeOrgao: 'Orgao',
        meio: null,
        link: null,
        tipoDocumento: null,
        numeroComunicacao: index + 10,
        hash: null,
        ativo: true,
        destinatarios: [],
        destinatarioadvogados: [],
      }));

      const fetchCommunications = jest
        .fn()
        .mockResolvedValueOnce({ items, total: items.length })
        .mockResolvedValueOnce({ items: [], total: items.length });
      const createSyncLog = jest.fn().mockResolvedValue(undefined);
      const upsertFromPje = jest.fn(async () => undefined);
      const syncService = new SyncService(
        { fetchCommunications, fetchTribunals: jest.fn() } as never,
        { createSyncLog, upsertFromPje } as never,
        { upsertMany: jest.fn() } as never,
      );

      let currentConcurrency = 0;
      let maxConcurrency = 0;

      upsertFromPje.mockImplementation(async () => {
        currentConcurrency += 1;
        maxConcurrency = Math.max(maxConcurrency, currentConcurrency);
        await new Promise((resolve) => setTimeout(resolve, 5));
        currentConcurrency -= 1;
      });

      await syncService['syncDate']('2026-04-14');

      expect(fetchCommunications).toHaveBeenNthCalledWith(1, {
        date: '2026-04-14',
        page: 1,
      });
      expect(upsertFromPje).toHaveBeenCalledTimes(items.length);
      expect(maxConcurrency).toBeGreaterThan(1);
      expect(maxConcurrency).toBeLessThanOrEqual(4);
      expect(createSyncLog).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'SUCCESS',
          recordsFetched: items.length,
          recordsSaved: items.length,
        }),
      );
    });
  });
});
