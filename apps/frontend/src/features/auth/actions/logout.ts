"use server";

import { cookies } from "next/headers";
import { authFetch } from "./auth-fetch";

export async function logoutAction(): Promise<
  { success: true } | { error: string; success: false }
> {
  const cookieStore = await cookies();

  try {
    await authFetch("/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        Cookie: cookieStore
          .getAll()
          .map(({ name, value }) => `${name}=${value}`)
          .join("; "),
      },
    });
  } catch {
    return {
      error: "Não foi possível encerrar sua sessão agora. Tente novamente.",
      success: false,
    };
  }

  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  return { success: true };
}
