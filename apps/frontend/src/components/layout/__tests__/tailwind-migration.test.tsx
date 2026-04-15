import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Navbar } from "../navbar";
import { Sidebar } from "../sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/communications",
}));

describe("Tailwind migration regressions", () => {
  it("uses valid Tailwind radius utilities in the dashboard chrome", () => {
    const navbarHtml = renderToStaticMarkup(
      <Navbar
        onToggleSidebar={() => {}}
        user={{ email: "gabi@example.com", id: "1", name: "Gabi Martins" }}
        userMenuMessages={{ error: "Erro ao sair", logout: "Sair da conta" }}
      />,
    );

    const sidebarHtml = renderToStaticMarkup(<Sidebar expanded={false} />);

    expect(navbarHtml).not.toContain("rounded-radius");
    expect(sidebarHtml).not.toContain("rounded-radius");
    expect(navbarHtml).toContain("rounded-md");
    expect(sidebarHtml).toContain("rounded-md");
  });
});
