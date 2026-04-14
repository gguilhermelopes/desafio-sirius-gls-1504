import { Injectable, Logger } from '@nestjs/common';

interface PjeCommunication {
  id: number;
  data_disponibilizacao: string;
  siglaTribunal: string;
  tipoComunicacao: string;
  nomeOrgao: string | null;
  texto: string;
  numero_processo: string;
  meio: string | null;
  link: string | null;
  tipoDocumento: string | null;
  nomeClasse: string | null;
  codigoClasse: string | null;
  numeroComunicacao: number | null;
  ativo: boolean;
  hash: string | null;
  destinatarios: { nome: string; polo: string | null; comunicacao_id: number }[];
  destinatarioadvogados: {
    advogado: { nome: string; numero_oab: string | null; uf_oab: string | null };
  }[];
}

interface PjeResponse {
  status: string;
  message: string;
  count: number;
  items: PjeCommunication[];
}

interface PjeTribunalResponse {
  uf: string;
  nomeEstado: string;
  instituicoes: { sigla: string; nome: string; dataUltimoEnvio: string; active?: boolean }[];
}

interface PjeTribunal {
  nome: string;
  sigla: string;
}

const PJE_BASE_URL = 'https://comunicaapi.pje.jus.br/api/v1';
const RATE_LIMIT_WAIT_MS = 60_000;

@Injectable()
export class PjeApiClient {
  private readonly logger = new Logger(PjeApiClient.name);

  async fetchCommunications(params: {
    date: string;
    page: number;
  }): Promise<{ items: PjeCommunication[]; total: number }> {
    const url = new URL(`${PJE_BASE_URL}/comunicacao`);
    url.searchParams.set('dataDisponibilizacaoInicio', params.date);
    url.searchParams.set('dataDisponibilizacaoFim', params.date);
    url.searchParams.set('itensPorPagina', '5');
    url.searchParams.set('pagina', String(params.page));

    const data = await this.fetchWithRateLimit<PjeResponse>(url.toString());

    return { items: data.items ?? [], total: data.count ?? 0 };
  }

  async fetchTribunals(): Promise<PjeTribunal[]> {
    const url = `${PJE_BASE_URL}/comunicacao/tribunal`;
    const data = await this.fetchWithRateLimit<PjeTribunalResponse[]>(url);

    const tribunals: PjeTribunal[] = [];
    const seen = new Set<string>();
    for (const state of data) {
      for (const inst of state.instituicoes) {
        if (!seen.has(inst.sigla)) {
          seen.add(inst.sigla);
          tribunals.push({ sigla: inst.sigla, nome: inst.nome });
        }
      }
    }
    return tribunals;
  }

  private async fetchWithRateLimit<T>(url: string, retries = 3): Promise<T> {
    for (let attempt = 0; attempt < retries; attempt++) {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(30_000),
      });

      if (response.status === 429) {
        await response.text(); // consume body before retry
        this.logger.warn(`Rate limited by PJE API, waiting ${RATE_LIMIT_WAIT_MS}ms...`);
        await this.sleep(RATE_LIMIT_WAIT_MS);
        continue;
      }

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`PJE API error: ${response.status} ${response.statusText} — ${body}`);
      }

      const remaining = response.headers.get('x-ratelimit-remaining');
      const data = (await response.json()) as T;

      if (remaining !== null && parseInt(remaining, 10) <= 1) {
        this.logger.warn('PJE rate limit nearly exhausted, pausing...');
        await this.sleep(RATE_LIMIT_WAIT_MS);
      }

      return data;
    }

    throw new Error('PJE API rate limit exceeded after retries');
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
