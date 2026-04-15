import { forwardAuthCookies } from "@/features/auth/actions/auth-fetch";

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const INTERNAL_API_URL = process.env.INTERNAL_API_URL;
const API_URL = INTERNAL_API_URL || PUBLIC_API_URL;

type CookieStore = {
  get: (name: string) => { value: string } | undefined;
  getAll: () => Array<{ name: string; value: string }>;
  set: (name: string, value: string, options: Record<string, unknown>) => void;
};

/**
 * Attempts to refresh auth tokens using the refresh_token cookie.
 * On success, sets the new cookies on the cookie store and returns true.
 */
export async function tryRefreshTokens(
  cookieStore: CookieStore,
): Promise<boolean> {
  if (!API_URL) return false;

  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    if (!response.ok) return false;

    forwardAuthCookies(response, cookieStore as Parameters<typeof forwardAuthCookies>[1]);
    return true;
  } catch {
    return false;
  }
}
