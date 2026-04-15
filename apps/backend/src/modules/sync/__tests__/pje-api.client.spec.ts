import { PjeApiClient } from '../pje-api.client';

describe('PjeApiClient', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch communications and map items and total', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: jest.fn().mockReturnValue('10') },
      json: jest.fn().mockResolvedValue({
        count: 2,
        items: [{ id: 1 }, { id: 2 }],
      }),
    }) as typeof fetch;

    const client = new PjeApiClient();

    await expect(
      client.fetchCommunications({ date: '2026-04-14', page: 3 }),
    ).resolves.toEqual({
      items: [{ id: 1 }, { id: 2 }],
      total: 2,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('pagina=3'),
      expect.any(Object),
    );
  });

  it('should retry after rate limiting and return deduplicated tribunals', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        status: 429,
        text: jest.fn().mockResolvedValue('slow down'),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: jest.fn().mockReturnValue('10') },
        json: jest.fn().mockResolvedValue([
          {
            uf: 'SP',
            nomeEstado: 'Sao Paulo',
            instituicoes: [
              { sigla: 'TJSP', nome: 'Tribunal SP', dataUltimoEnvio: '2026-04-14' },
              { sigla: 'TJSP', nome: 'Tribunal SP', dataUltimoEnvio: '2026-04-14' },
              { sigla: 'TRT2', nome: 'Tribunal TRT2', dataUltimoEnvio: '2026-04-14' },
            ],
          },
        ]),
      }) as typeof fetch;

    const client = new PjeApiClient();
    jest
      .spyOn(client as never, 'sleep' as never)
      .mockResolvedValue(undefined as never);

    await expect(client.fetchTribunals()).resolves.toEqual([
      { sigla: 'TJSP', nome: 'Tribunal SP' },
      { sigla: 'TRT2', nome: 'Tribunal TRT2' },
    ]);

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
