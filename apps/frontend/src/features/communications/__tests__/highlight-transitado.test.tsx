import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HighlightTransitado } from "../components/highlight-transitado";

describe("HighlightTransitado", () => {
  it("should highlight 'transitou em julgado' occurrences", () => {
    const html = renderToStaticMarkup(
      <HighlightTransitado text="O processo transitou em julgado ontem." />,
    );

    expect(html).toContain('class="font-bold text-red-700"');
    expect(html).toContain("transitou em julgado");
  });

  it("should render plain text when there is no matching expression", () => {
    const html = renderToStaticMarkup(
      <HighlightTransitado text="Sem expressão especial." />,
    );

    expect(html).toContain("Sem expressão especial.");
    expect(html).not.toContain('class="font-bold text-red-700"');
  });
});
