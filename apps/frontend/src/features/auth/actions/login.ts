import { ApiError, apiFetch } from "@/lib/api/fetcher";
import { AuthUser, LoginRequest } from "@juscash/shared";
import {
  AuthActionResult,
  LoginInput,
  loginSchema,
  mapFieldErrors,
} from "../schemas/auth";

type LoginField = Extract<keyof LoginRequest, string>;

export async function loginAction(
  input: LoginInput,
): Promise<AuthActionResult<LoginField>> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: "Verifique seus dados e tente novamente.",
      fieldErrors: mapFieldErrors<LoginField>(parsed.error),
      success: false,
    };
  }

  try {
    await apiFetch<AuthUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });

    return { success: true };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return {
        error: "E-mail ou senha inválidos.",
        success: false,
      };
    }

    return {
      error: "Não foi possível entrar agora. Tente novamente.",
      success: false,
    };
  }
}
