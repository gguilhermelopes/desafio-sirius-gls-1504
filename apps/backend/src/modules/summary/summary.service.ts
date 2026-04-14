import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SummaryService {
  private readonly logger = new Logger(SummaryService.name);
  private readonly apiKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
  }

  async generateSummary(content: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Você é um assistente jurídico especializado. Resuma a comunicação processual abaixo em linguagem clara e objetiva, destacando decisões, prazos e obrigações das partes. Responda em português.',
          },
          { role: 'user', content },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`OpenAI API error: ${response.status} ${body}`);
      throw new Error('Failed to generate summary');
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };

    return data.choices[0]?.message?.content ?? 'Não foi possível gerar o resumo.';
  }
}
