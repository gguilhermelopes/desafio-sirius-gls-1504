import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: () => [],
    set: vi.fn(),
    delete: vi.fn(),
  }),
}));

describe("logoutAction", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.test");
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns success when the API clears the session", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

    const { logoutAction } = await import("../actions/logout");
    const result = await logoutAction();

    expect(result).toEqual({ success: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/auth/logout",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("returns a friendly error when the API fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Network error"));

    const { logoutAction } = await import("../actions/logout");
    const result = await logoutAction();

    expect(result).toEqual({
      error: "Não foi possível encerrar sua sessão agora. Tente novamente.",
      success: false,
    });
  });
});
