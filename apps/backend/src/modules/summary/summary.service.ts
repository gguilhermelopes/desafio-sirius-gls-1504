import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SummaryService {
  private readonly logger = new Logger(SummaryService.name);
  private readonly apiKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
  }

  async generateSummary(content: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: 'Você é um assistente jurídico especializado. Resuma a comunicação processual abaixo em linguagem clara e objetiva, destacando decisões, prazos e obrigações das partes. Responda em português.',
              },
            ],
          },
          contents: [{ parts: [{ text: content }] }],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.3,
          },
        }),
        signal: AbortSignal.timeout(30_000),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`Gemini API error: ${response.status} ${body}`);
      throw new Error('Failed to generate summary');
    }

    const data = (await response.json()) as {
      candidates: { content: { parts: { text: string }[] } }[];
    };

    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      'Não foi possível gerar o resumo.'
    );
  }
}
