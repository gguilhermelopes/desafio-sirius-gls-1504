import { ApiError, apiFetch } from "@/lib/api/fetcher";
import { AuthUser, RegisterRequest } from "@juscash/shared";
import {
  AuthActionResult,
  RegisterInput,
  mapFieldErrors,
  registerSchema,
} from "../schemas/auth";

type RegisterField = Extract<keyof RegisterRequest, string>;

export async function registerAction(
  input: RegisterInput,
): Promise<AuthActionResult<RegisterField>> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: "Revise os campos obrigatórios antes de continuar.",
      fieldErrors: mapFieldErrors<RegisterField>(parsed.error),
      success: false,
    };
  }

  try {
    await apiFetch<AuthUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });

    return { success: true };
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return {
        error: "Este e-mail já está em uso.",
        success: false,
      };
    }

    return {
      error: "Não foi possível criar sua conta agora. Tente novamente.",
      success: false,
    };
  }
}
