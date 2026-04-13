import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AuthPasswordField } from "./auth-password-field";
import { AuthSubmitButton } from "./auth-submit-button";
import { AuthTextField } from "./auth-text-field";

describe("Auth primitives", () => {
  it("renders shared auth components with the expected structure", () => {
    const html = renderToStaticMarkup(
      <>
        <AuthTextField
          autoComplete="email"
          error="Digite um e-mail válido."
          inputClassName="login-input"
          label="E-mail"
          labelClassName="login-field-label"
          name="email"
          placeholder="seu@email.com"
          shellClassName="login-input-shell"
          type="email"
        />
        <AuthPasswordField
          inputClassName="login-input"
          label="Senha"
          labelClassName="login-field-label"
          placeholder="*******"
          shellClassName="login-input-shell"
          toggleButtonClassName="login-password-toggle"
          toggleIconClassName="login-password-icon"
        />
        <AuthSubmitButton className="login-submit">Entrar</AuthSubmitButton>
      </>,
    );

    expect(html).toContain("Digite um e-mail válido.");
    expect(html).toContain("Mostrar senha");
    expect(html).toContain(">Entrar<");
  });
});
