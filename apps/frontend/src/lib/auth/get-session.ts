import { cookies } from "next/headers";
import { AuthUser } from "@juscash/shared";
import { apiFetch, ApiError } from "@/lib/api/fetcher";
import { tryRefreshTokens } from "./refresh-tokens";

export async function getSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (!refreshToken) return null;

    const refreshed = await tryRefreshTokens(cookieStore);
    if (!refreshed) return null;

    return fetchMe(cookieStore);
  }

  try {
    return await apiFetch<AuthUser>("/auth/me", {
      headers: {
        Cookie: buildCookieHeader(cookieStore.getAll()),
      },
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      const refreshed = await tryRefreshTokens(cookieStore);
      if (!refreshed) return null;

      return fetchMe(cookieStore);
    }

    return null;
  }
}

async function fetchMe(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): Promise<AuthUser | null> {
  try {
    return await apiFetch<AuthUser>("/auth/me", {
      headers: {
        Cookie: buildCookieHeader(cookieStore.getAll()),
      },
    });
  } catch {
    return null;
  }
}

export async function hasSession() {
  const session = await getSession();
  return Boolean(session);
}

export function buildCookieHeader(cookiesToSerialize: Array<{ name: string; value: string }>) {
  return cookiesToSerialize.map(({ name, value }) => `${name}=${value}`).join("; ");
}
