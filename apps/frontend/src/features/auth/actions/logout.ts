import { apiFetch } from "../../../lib/api/fetcher";

export async function logoutAction(): Promise<
  { success: true } | { error: string; success: false }
> {
  try {
    await apiFetch<null>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
    });

    return { success: true };
  } catch {
    return {
      error: "Não foi possível encerrar sua sessão agora. Tente novamente.",
      success: false,
    };
  }
}
