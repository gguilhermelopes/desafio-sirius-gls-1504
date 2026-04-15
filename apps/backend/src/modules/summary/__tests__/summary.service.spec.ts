import { ConfigService } from '@nestjs/config';
import { SummaryService } from '../summary.service';

describe('SummaryService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw when GROQ_API_KEY is not configured', async () => {
    const service = new SummaryService({
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as ConfigService);

    await expect(service.generateSummary('conteudo')).rejects.toThrow(
      'GROQ_API_KEY is not configured',
    );
  });

  it('should request a summary and return the first completion content', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'Resumo gerado' } }],
      }),
    });
    global.fetch = fetchMock as typeof fetch;
    const service = new SummaryService({
      get: jest.fn().mockReturnValue('test-key'),
    } as unknown as ConfigService);

    await expect(service.generateSummary('texto original')).resolves.toBe(
      'Resumo gerado',
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.groq.com/openai/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-key',
          'Content-Type': 'application/json',
        }),
      }),
    );
  });
});
