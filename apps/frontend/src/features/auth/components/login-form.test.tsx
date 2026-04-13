import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "./login-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("../actions/login", () => ({
  loginAction: vi.fn(),
}));

describe("LoginForm", () => {
  it("renders the figma-aligned login form content", () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
        queries: { retry: false },
      },
    });
    const html = renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <LoginForm
          messages={{
            auth: {
              emailLabel: "E-mail",
              invalidCredentials: "E-mail ou senha inválidos.",
              loginButton: "Entrar",
              passwordLabel: "Senha",
              registerLink: "Não tem conta? Cadastre-se",
              unexpectedError: "Ocorreu um erro inesperado. Tente novamente.",
            },
          }}
        />
      </QueryClientProvider>,
    );

    expect(html).toContain("login-form");
    expect(html).toContain("placeholder=\"seu@email.com\"");
    expect(html).toContain("placeholder=\"*******\"");
    expect(html).toContain("Mostrar senha");
    expect(html).toContain(">Entrar<");
    expect(html).toContain("Não tem conta?");
    expect(html).toContain(">Cadastre-se<");
  });
});
