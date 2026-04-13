import { cookies } from "next/headers";
import { AuthUser } from "@juscash/shared";
import { apiFetch } from "@/lib/api/fetcher";

export async function getSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

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

function buildCookieHeader(cookiesToSerialize: Array<{ name: string; value: string }>) {
  return cookiesToSerialize.map(({ name, value }) => `${name}=${value}`).join("; ");
}
