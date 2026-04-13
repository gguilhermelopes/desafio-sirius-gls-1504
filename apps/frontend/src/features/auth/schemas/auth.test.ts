import { describe, expect, it } from "vitest";
import { loginSchema, mapFieldErrors, registerSchema } from "./auth";

describe("registerSchema", () => {
  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      name: "Maria",
      email: "maria@example.com",
      password: "12345678",
      passwordConfirmation: "87654321",
    });

    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("returns user-friendly validation messages in pt-BR", () => {
    const result = loginSchema.safeParse({
      email: "email-invalido",
      password: "123",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("loginSchema deveria falhar para dados inválidos");
    }

    expect(mapFieldErrors(result.error)).toEqual({
      email: "Digite um e-mail válido.",
      password: "A senha deve ter pelo menos 8 caracteres.",
    });
  });
});
