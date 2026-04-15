import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { UserMenu } from "../user-menu";

vi.mock("@/features/auth/actions/logout", () => ({
  logoutAction: vi.fn(),
}));

describe("UserMenu", () => {
  const messages = {
    error: "Erro ao sair",
    logout: "Sair da conta",
  };

  it("renders the trigger closed by default", () => {
    const html = renderToStaticMarkup(
      <UserMenu initials="CN" messages={messages} userName="Carlos Nunes" />,
    );

    expect(html).toContain("CN");
    expect(html).not.toContain("Sair da conta");
  });

  it("renders the modal content when forced open", () => {
    const html = renderToStaticMarkup(
      <UserMenu
        forceOpen
        initials="CN"
        messages={messages}
        userName="Carlos Nunes"
      />,
    );

    expect(html).toContain("Carlos Nunes");
    expect(html).toContain("Sair da conta");
    expect(html).toContain("CN");
    expect(html).toContain("Menu do usuário Carlos Nunes");
  });
});
