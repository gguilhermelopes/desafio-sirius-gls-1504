# JusCash — Teste Tecnico

Plataforma para consulta de comunicacoes processuais do Diario de Justica Eletronico Nacional. Inclui autenticacao, filtros, paginacao e resumo automatico por IA.

## Producao

| | URL |
|---|---|
| Frontend | https://teste-tecnico-juscash-frontend.vercel.app |
| Backend | https://teste-tecnico-juscash.onrender.com |

> O backend no Render pode levar alguns segundos pra acordar na primeira requisicao (free tier).

**Credenciais de teste:**
```
Email: teste@teste.com
Senha: 123456789
```

## Arquitetura

```
Browser
  |
  v
Vercel (Next.js SSR + API Proxy)
  |
  v
Render (NestJS API) ---> PostgreSQL
  |         |
  v         v
Groq API   PJE API
(resumos)  (sync diario)
```

O frontend no Vercel faz proxy das requisicoes client-side pro backend via API route (`/api/proxy/*`), injetando cookies de autenticacao. Isso resolve o problema de cookies cross-origin entre dominios diferentes.

## Tech Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15, React 18, Tailwind CSS 4, React Query |
| Backend | NestJS 10, Prisma 5, PostgreSQL 16 |
| IA | Groq (Llama 3.3 70B) |
| Infra | Docker Compose, Vercel, Render |
| Monorepo | pnpm workspaces, Turborepo |
| Testes | Jest (backend), Vitest (frontend) |

## Setup local

1. Clone o repositorio:
```bash
git clone <url-do-repo>
cd teste-tecnico
```

2. Copie o arquivo de variaveis de ambiente:
```bash
cp .env.example .env
```

3. (Opcional) Configure a chave da Groq pra resumos com IA:
```bash
# Pegue em https://console.groq.com
GROQ_API_KEY=gsk_sua_chave_aqui
```

4. Suba os containers:
```bash
docker compose up --build
```

5. Aguarde o seed terminar — o servico `backend-seed` vai popular o banco com comunicacoes dos ultimos 20 dias da API do PJE.

6. Acesse http://localhost:3100

### Comandos uteis

```bash
docker compose up --build     # inicia tudo
docker compose down           # para tudo
docker compose logs -f        # acompanha logs
```


## Decisoes tecnicas

### Monorepo com pnpm workspaces + Turborepo

Optei por monorepo porque precisava compartilhar os tipos de resposta da API entre front e back. O pacote `@juscash/shared` centraliza esses contratos e o Turborepo cuida da ordem de build.

### Backend — NestJS + Prisma

Fui de NestJS pela estrutura modular — cada dominio (auth, communications, summary, sync) fica no seu modulo com responsabilidades bem definidas. Prisma como ORM porque gera os tipos direto do schema e as migrations ficam versionadas junto do codigo.

### Frontend — Next.js 15 App Router

Usei Server Components nas paginas de listagem pra buscar dados no servidor sem impactar o client. Componentes client ficaram restritos a interacoes (filtros, modais, forms). Criei uma API proxy route no Next.js pra resolver um problema de cookies cross-origin que apareceu no deploy com Vercel + Render.

### Autenticacao

Access token de 15min + refresh token de 7 dias, ambos em cookies HttpOnly. O refresh faz rotacao — cada uso invalida o anterior. No deploy, como front e back estao em dominios diferentes, as server actions do Next.js fazem proxy da auth pra manter os cookies no mesmo dominio. O refresh acontece de forma transparente tanto no SSR quanto nas requisicoes client-side.

### Paginacao

Offset com 8 itens por pagina. Retorna total e totalPages no meta da resposta.

### Tratamento de erros

Criei error boundaries (`error.tsx`) no nivel global e no dashboard, com botao de retry. Pagina 404 customizada pro caso de processo nao encontrado. O filtro de tribunais mostra estado de erro com opcao de tentar de novo ao inves de falhar em silencio. Mensagens de erro usam `role="alert"` pra acessibilidade.

### IA — Groq

Resumos gerados sob demanda com Llama 3.3 70B via Groq. Ficam cacheados no banco pra nao repetir chamada.
### Sync com PJE

Cron diario as 1h puxa comunicacoes da API do PJE. Faz upsert idempotente e trata rate-limit (espera 60s no 429). Cada execucao registra um log pra acompanhamento.

## O que melhoraria com mais tempo

- Testes e2e no frontend com Playwright cobrindo os fluxos principais
- Middleware de auth no Next.js ao inves de verificar sessao no layout
- Trocar paginacao offset por cursor-based se o volume de dados crescer
- Redis pra cache de sessao e resumos
- Observabilidade com Sentry e metricas de request
- Pipeline de CI/CD no GitHub Actions

## Uso de IA

Usei o Codex pra montar a estrutura inicial do projeto e gerar o boilerplate dos modulos.

Depois usei o Claude Code como apoio durante o desenvolvimento — ajustes de layout pro Figma, implementacao do auth com cookie forwarding pro deploy cross-origin, error boundaries, integracao com as APIs de IA e o proxy de API no Next.js.

No geral, usei IA pra ganhar velocidade nas partes mais mecanicas e bracais. Cada output foi revisado e adaptado pro contexto. Acho que saber usar essas ferramentas bem faz parte do trabalho hoje.
