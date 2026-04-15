import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ReadMoreToggle } from "../components/read-more-toggle";

describe("ReadMoreToggle", () => {
  it("should render the truncated state and toggle button for long content", () => {
    const html = renderToStaticMarkup(
      <ReadMoreToggle
        content={"a".repeat(301)}
        readMoreLabel="Ler mais"
        readLessLabel="Ler menos"
      />,
    );

    expect(html).toContain("line-clamp-3");
    expect(html).toContain(">Ler mais<");
  });

  it("should not render a toggle button for short content", () => {
    const html = renderToStaticMarkup(
      <ReadMoreToggle
        content="Texto curto"
        readMoreLabel="Ler mais"
        readLessLabel="Ler menos"
      />,
    );

    expect(html).toContain("line-clamp-3");
    expect(html).not.toContain(">Ler mais<");
  });

  it("should render normalized HTML content as readable text", () => {
    const html = renderToStaticMarkup(
      <ReadMoreToggle
        content={'Linha 1<br>Linha 2 <a href="https://exemplo.com">Link</a>'}
        readMoreLabel="Ler mais"
        readLessLabel="Ler menos"
      />,
    );

    expect(html).toContain("Linha 1<br/>Linha 2");
    expect(html).toContain('href="https://exemplo.com"');
    expect(html).toContain(">Link<");
    expect(html).not.toContain("&lt;br&gt;");
    expect(html).not.toContain("&lt;a");
  });
});
