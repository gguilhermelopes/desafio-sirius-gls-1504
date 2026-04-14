import React from "react";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "../components/login-form";
import { loginMessages, renderWithQueryClient } from "./helpers";

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
    const html = renderWithQueryClient(
      <LoginForm messages={loginMessages} />,
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
