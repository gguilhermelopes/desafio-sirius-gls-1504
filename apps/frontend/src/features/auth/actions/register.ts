"use server";

import { cookies } from "next/headers";
import { RegisterRequest } from "@juscash/shared";
import {
  AuthActionResult,
  mapFieldErrors,
  registerSchema,
} from "../schemas/auth";
import { authFetch, forwardAuthCookies } from "./auth-fetch";

type RegisterField = Extract<keyof RegisterRequest, string>;

export async function registerAction(
  input: RegisterRequest,
): Promise<AuthActionResult<RegisterField>> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: "Revise os campos obrigatórios antes de continuar.",
      fieldErrors: mapFieldErrors<RegisterField>(parsed.error),
      success: false,
    };
  }

  const response = await authFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });

  if (!response.ok) {
    if (response.status === 409) {
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

  const cookieStore = await cookies();
  forwardAuthCookies(response, cookieStore);

  return { success: true };
}
