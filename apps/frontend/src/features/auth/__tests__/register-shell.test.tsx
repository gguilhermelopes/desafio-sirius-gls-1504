import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LoginShell } from "../components/login-shell";

describe("Register shell", () => {
  it("renders the visual auth shell with cadastro content", () => {
    const html = renderToStaticMarkup(
      <LoginShell
        footerText="© 2026 • Juscash Administração de Pagamentos e Recebimentos SA"
        heroText="Antecipe honorários advocatícios com a JusCash"
        subtitle="Preencha os dados para se cadastrar"
        title="Criar conta"
      >
        <form className="register-form" />
      </LoginShell>,
    );

    expect(html).toContain("login-layout");
    expect(html).toContain("Criar conta");
    expect(html).toContain("Preencha os dados para se cadastrar");
    expect(html).toContain("register-form");
  });
});
