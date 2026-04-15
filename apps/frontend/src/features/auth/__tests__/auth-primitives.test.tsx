import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AuthPasswordField } from "../components/auth-password-field";
import { AuthSubmitButton } from "../components/auth-submit-button";
import { AuthTextField } from "../components/auth-text-field";

describe("Auth primitives", () => {
  it("renders shared auth components with the expected structure", () => {
    const html = renderToStaticMarkup(
      <>
        <AuthTextField
          autoComplete="email"
          error="Digite um e-mail válido."
          label="E-mail"
          name="email"
          placeholder="seu@email.com"
          type="email"
        />
        <AuthPasswordField
          label="Senha"
          placeholder="*******"
        />
        <AuthSubmitButton>Entrar</AuthSubmitButton>
      </>,
    );

    expect(html).toContain("Digite um e-mail válido.");
    expect(html).toContain("Mostrar senha");
    expect(html).toContain(">Entrar<");
  });
});
