import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LoginShell } from "../components/login-shell";

describe("LoginShell", () => {
  it("renders the figma-based login structure", () => {
    const html = renderToStaticMarkup(
      <LoginShell
        footerText="© 2026 • Juscash Administração de Pagamentos e Recebimentos SA"
        heroText="Antecipe honorários advocatícios com a JusCash"
        subtitle="Acesse sua conta para continuar"
        title="Bem-vindo de volta"
      >
        <form />
      </LoginShell>,
    );

    expect(html).toContain("min-h-screen");
    expect(html).toContain("/img/image.png");
    expect(html).toContain("/logos/logo.png");
    expect(html).toContain("/logos/logo-mobile.png");
    expect(html).toContain("Bem-vindo de volta");
    expect(html).toContain("Acesse sua conta para continuar");
    expect(html).toContain("lg:grid-cols-[minmax(0,1016px)_minmax(0,904px)]");
    expect(html).toContain("max-w-[312px]");
    expect(html).toContain("sm:max-w-[460px]");
    expect(html).toContain("h-[calc(100vh-48px)]");
    expect(html).toContain("flex-col items-center");
    expect(html).toContain(
      "© 2026 • Juscash Administração de Pagamentos e Recebimentos SA",
    );
  });
});
