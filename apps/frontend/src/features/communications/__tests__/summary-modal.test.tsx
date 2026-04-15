import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SummaryModal } from "../components/summary-modal";

describe("SummaryModal", () => {
  const messages = {
    summaryModalTitle: "Resumo",
    summaryModalDescription: "Descrição",
    summaryModalClose: "Fechar",
    summaryLoading: "Gerando resumo...",
  };

  it("should render modal content when open", () => {
    const html = renderToStaticMarkup(
      <SummaryModal
        open
        onClose={() => {}}
        summary="Resumo pronto"
        loading={false}
        error={null}
        messages={messages}
      />,
    );

    expect(html).toContain("Resumo");
    expect(html).toContain("Descrição");
    expect(html).toContain("Resumo pronto");
    expect(html).toContain(">Fechar<");
  });

  it("should render loading and error states", () => {
    const html = renderToStaticMarkup(
      <SummaryModal
        open
        onClose={() => {}}
        summary={null}
        loading
        error="Falhou"
        messages={messages}
      />,
    );

    expect(html).toContain("Gerando resumo...");
    expect(html).toContain("Falhou");
  });
});
