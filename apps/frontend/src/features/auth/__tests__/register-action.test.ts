import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

describe("registerAction", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.test");
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns field errors when local validation fails", async () => {
    const { registerAction } = await import("../actions/register");

    const result = await registerAction({
      name: "",
      email: "invalido",
      password: "123",
      passwordConfirmation: "87654321",
    });

    expect(result).toEqual({
      error: "Revise os campos obrigatórios antes de continuar.",
      fieldErrors: {
        email: "Digite um e-mail válido.",
        name: "Digite seu nome completo.",
        password: "A senha deve ter pelo menos 8 caracteres.",
        passwordConfirmation: "As senhas precisam ser iguais.",
      },
      success: false,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns the duplicate email message when the API responds with 409", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Conflict" }), {
        status: 409,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    const { registerAction } = await import("../actions/register");

    const result = await registerAction({
      name: "Maria",
      email: "maria@example.com",
      password: "12345678",
      passwordConfirmation: "12345678",
    });

    expect(result).toEqual({
      error: "Este e-mail já está em uso.",
      success: false,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/auth/register",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });
});
