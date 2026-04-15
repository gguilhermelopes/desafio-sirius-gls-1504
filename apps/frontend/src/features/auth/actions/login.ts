"use server";

import { cookies } from "next/headers";
import { LoginRequest } from "@juscash/shared";
import {
  AuthActionResult,
  loginSchema,
  mapFieldErrors,
} from "../schemas/auth";
import { authFetch, forwardAuthCookies } from "./auth-fetch";

type LoginField = Extract<keyof LoginRequest, string>;

export async function loginAction(
  input: LoginRequest,
): Promise<AuthActionResult<LoginField>> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: "Verifique seus dados e tente novamente.",
      fieldErrors: mapFieldErrors<LoginField>(parsed.error),
      success: false,
    };
  }

  const response = await authFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });

  if (!response.ok) {
    if (response.status === 401) {
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

  const cookieStore = await cookies();
  forwardAuthCookies(response, cookieStore);

  return { success: true };
}
