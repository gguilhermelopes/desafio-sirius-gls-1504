import React from "react";
import { describe, expect, it, vi } from "vitest";
import { RegisterForm } from "../components/register-form";
import { registerMessages, renderWithQueryClient } from "./helpers";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("../actions/register", () => ({
  registerAction: vi.fn(),
}));

describe("RegisterForm", () => {
  it("renders the figma-aligned register form content", () => {
    const html = renderWithQueryClient(
      <RegisterForm messages={registerMessages} />,
    );

    expect(html).toContain("register-form");
    expect(html).toContain("placeholder=\"Seu nome\"");
    expect(html).toContain("placeholder=\"seu@email.com\"");
    expect(html).toContain("placeholder=\"*******\"");
    expect(html).toContain("Mínimo de 8 caracteres");
    expect(html).toContain(">Criar conta<");
    expect(html).toContain("Já tem conta?");
    expect(html).toContain(">Entrar<");
  });
});
