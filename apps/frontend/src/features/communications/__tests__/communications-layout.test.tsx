import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CommunicationCard } from "../components/communication-card";
import { Pagination } from "../components/pagination";

describe("Communications responsive layout", () => {
  it("stacks card metadata on smaller screens", () => {
    const html = renderToStaticMarkup(
      <CommunicationCard
        item={{
          communicationNumber: null,
          content: "Conteudo de teste",
          id: "1",
          pjeId: 10,
          process: {
            className: "Cumprimento de sentenca",
            number: "0000000-00.0000.0.00.0000",
            tribunal: {
              sigla: "TJAL",
            },
          },
          publicationDate: "2026-04-13T00:00:00.000Z",
          recipients: [{ name: "Fulano de Tal", type: "PARTY" }],
          type: "Intimacao",
        }}
        messages={{
          communicationType: "Tipo da comunicação",
          content: "Conteúdo",
          date: "Data",
          process: "Processo",
          recipients: "Destinatários",
          summarize: "Resumir",
          summaryModalTitle: "Resumo com IA",
          summaryModalDescription: "Resumo gerado automaticamente.",
          summaryModalClose: "Fechar",
          summaryLoading: "Gerando resumo...",
          summaryError: "Erro ao gerar resumo.",
          tribunal: "Tribunal",
        }}
      />,
    );

    expect(html).toContain("grid-cols-1");
    expect(html).toContain("sm:grid-cols-2");
  });

  it("allows pagination controls to wrap instead of overflowing the viewport", () => {
    const html = renderToStaticMarkup(
      <Pagination
        meta={{ page: 85, limit: 8, total: 864, totalPages: 108 }}
        nextLabel="Próximo"
        previousLabel="Anterior"
        searchParams={{}}
      />,
    );

    expect(html).toContain("flex-wrap");
  });
});
