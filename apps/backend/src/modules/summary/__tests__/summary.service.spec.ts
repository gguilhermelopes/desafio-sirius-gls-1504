import { ConfigService } from '@nestjs/config';
import { SummaryService } from '../summary.service';

describe('SummaryService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw when GEMINI_API_KEY is not configured', async () => {
    const service = new SummaryService({
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as ConfigService);

    await expect(service.generateSummary('conteudo')).rejects.toThrow(
      'GEMINI_API_KEY is not configured',
    );
  });

  it('should request a summary and return the first candidate text', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        candidates: [{ content: { parts: [{ text: 'Resumo gerado' }] } }],
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
      expect.stringContaining(
        'generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      ),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
  });
});
