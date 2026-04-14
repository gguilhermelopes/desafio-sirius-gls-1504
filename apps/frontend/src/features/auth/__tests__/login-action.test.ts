import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

describe("loginAction", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.test");
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns a password validation error for an empty password", async () => {
    const { loginAction } = await import("../actions/login");

    const result = await loginAction({
      email: "maria@example.com",
      password: "",
    });

    expect(result).toEqual({
      error: "Verifique seus dados e tente novamente.",
      fieldErrors: {
        password: "Digite sua senha.",
      },
      success: false,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns the invalid credentials message when the API responds with 401", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    const { loginAction } = await import("../actions/login");

    const result = await loginAction({
      email: "maria@example.com",
      password: "12345678",
    });

    expect(result).toEqual({
      error: "E-mail ou senha inválidos.",
      success: false,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/auth/login",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });
});
