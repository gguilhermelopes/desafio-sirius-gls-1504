import { describe, expect, it } from "vitest";
import { normalizeCommunicationContent } from "../lib/content-format";

describe("normalizeCommunicationContent", () => {
  it("converts line-break tags into readable line breaks", () => {
    expect(normalizeCommunicationContent("Primeira linha<br>Segunda linha<br/>Terceira"))
      .toBe("Primeira linha\nSegunda linha\nTerceira");
  });

  it("normalizes anchor tags into safe plain text", () => {
    expect(
      normalizeCommunicationContent(
        'Veja <a target="_blank" href="https://pje.jus.br/doc">o documento</a> agora.',
      ),
    ).toBe("Veja o documento (https://pje.jus.br/doc) agora.");
  });
});
