import { describe, expect, it } from "vitest";
import { loginSchema, mapFieldErrors, registerSchema } from "../schemas/auth";

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

  it("returns user-friendly validation messages in pt-BR", () => {
    const result = registerSchema.safeParse({
      name: "",
      email: "email-invalido",
      password: "123",
      passwordConfirmation: "87654321",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("registerSchema deveria falhar para dados inválidos");
    }

    expect(mapFieldErrors(result.error)).toEqual({
      name: "Digite seu nome completo.",
      email: "Digite um e-mail válido.",
      password: "A senha deve ter pelo menos 8 caracteres.",
      passwordConfirmation: "As senhas precisam ser iguais.",
    });
  });
});

describe("loginSchema", () => {
  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "maria@example.com",
      password: "",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("loginSchema deveria falhar para senha vazia");
    }

    expect(mapFieldErrors(result.error)).toEqual({
      password: "Digite sua senha.",
    });
  });

  it("rejects a password containing only whitespace", () => {
    const result = loginSchema.safeParse({
      email: "maria@example.com",
      password: "   ",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("loginSchema deveria falhar para senha em branco");
    }

    expect(mapFieldErrors(result.error)).toEqual({
      password: "Digite sua senha.",
    });
  });

  it("accepts a non-empty password even when it is shorter than 8 characters", () => {
    const result = loginSchema.safeParse({
      email: "maria@example.com",
      password: "123",
    });

    expect(result.success).toBe(true);
  });
});
