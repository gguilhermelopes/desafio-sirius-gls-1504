import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthUser } from "@juscash/shared";

const redirectMock = vi.fn((path: string) => {
  throw new Error(`REDIRECT:${path}`);
});

const getSessionMock = vi.fn<() => Promise<AuthUser | null>>();

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/lib/auth/get-session", () => ({
  getSession: getSessionMock,
  hasSession: vi.fn(),
}));

vi.mock("@/components/layout/navbar", () => ({
  Navbar: ({ user }: { user: AuthUser }) => (
    <div>
      <span>{user.name}</span>
      <span>{user.email}</span>
    </div>
  ),
}));

vi.mock("@/components/layout/sidebar", () => ({
  Sidebar: () => <div>Sidebar</div>,
}));

describe("auth routing", () => {
  beforeEach(() => {
    redirectMock.mockClear();
    getSessionMock.mockReset();
  });

  it("redirects the home page to /login when no session exists", async () => {
    getSessionMock.mockResolvedValue(null);
    const { default: HomePage } = await import("./page");

    await expect(HomePage()).rejects.toThrow("REDIRECT:/login");
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("redirects the communications page to /login when no session exists", async () => {
    getSessionMock.mockResolvedValue(null);
    const { default: DashboardLayout } = await import("./(dashboard)/layout");

    await expect(
      DashboardLayout({ children: <div>Protected content</div> }),
    ).rejects.toThrow("REDIRECT:/login");
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("renders the dashboard layout when a session exists", async () => {
    getSessionMock.mockResolvedValue({
      email: "frontend.smoke@juscash.com",
      id: "user-1",
      name: "Frontend Smoke",
    });
    const { default: DashboardLayout } = await import("./(dashboard)/layout");

    const page = await DashboardLayout({
      children: <div>Protected content</div>,
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("Frontend Smoke");
    expect(html).toContain("Protected content");
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
