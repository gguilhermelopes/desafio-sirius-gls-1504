import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AuthFooterLink } from "./auth-footer-link";
import { AuthInlineError } from "./auth-inline-error";
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
        <AuthInlineError className="login-inline-error">
          Verifique seus dados e tente novamente.
        </AuthInlineError>
        <AuthSubmitButton className="login-submit">Entrar</AuthSubmitButton>
        <AuthFooterLink
          className="login-footer-link"
          href="/register"
          linkLabel="Cadastre-se"
          prefix="Não tem conta?"
        />
      </>,
    );

    expect(html).toContain("Digite um e-mail válido.");
    expect(html).toContain("Verifique seus dados e tente novamente.");
    expect(html).toContain(">Entrar<");
    expect(html).toContain("Não tem conta?");
    expect(html).toContain(">Cadastre-se<");
  });
});
