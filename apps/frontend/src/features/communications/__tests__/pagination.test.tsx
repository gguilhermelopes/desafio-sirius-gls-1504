import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Pagination } from "../components/pagination";

describe("Pagination", () => {
  it("renders a compact page window for large result sets", () => {
    const html = renderToStaticMarkup(
      <Pagination
        meta={{ page: 85, limit: 8, total: 864, totalPages: 108 }}
        nextLabel="Próximo"
        previousLabel="Anterior"
        searchParams={{}}
      />,
    );

    expect(html).toContain(">1<");
    expect(html).toContain(">84<");
    expect(html).toContain(">85<");
    expect(html).toContain(">86<");
    expect(html).toContain(">108<");
    expect(html).toContain("...");
    expect(html).not.toContain(">63<");
    expect(html).not.toContain(">107</a><a");
  });
});
