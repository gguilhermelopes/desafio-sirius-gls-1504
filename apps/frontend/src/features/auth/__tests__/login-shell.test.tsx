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

    expect(html).toContain("login-layout");
    expect(html).toContain("login-media");
    expect(html).toContain("/img/image.png");
    expect(html).toContain("/logos/logo.png");
    expect(html).toContain("/logos/logo-mobile.png");
    expect(html).toContain("Bem-vindo de volta");
    expect(html).toContain("Acesse sua conta para continuar");
    expect(html).toContain(
      "© 2026 • Juscash Administração de Pagamentos e Recebimentos SA",
    );
  });
});
