import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const INTERNAL_API_URL = process.env.INTERNAL_API_URL;
const API_URL = INTERNAL_API_URL || PUBLIC_API_URL;

export async function authFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  return fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

export function forwardAuthCookies(
  response: Response,
  cookieStore: ReadonlyRequestCookies,
) {
  const setCookieHeaders = response.headers.getSetCookie();

  for (const header of setCookieHeaders) {
    const parsed = parseSetCookie(header);
    if (!parsed) continue;

    (cookieStore as unknown as { set: (name: string, value: string, options: Record<string, unknown>) => void }).set(
      parsed.name,
      parsed.value,
      {
        httpOnly: parsed.httpOnly,
        maxAge: parsed.maxAge,
        path: parsed.path,
        sameSite: parsed.sameSite as "lax" | "strict" | "none",
        secure: parsed.secure,
      },
    );
  }
}

function parseSetCookie(header: string) {
  const parts = header.split(";").map((p) => p.trim());
  const [nameValue, ...attributes] = parts;

  if (!nameValue) return null;

  const eqIndex = nameValue.indexOf("=");
  if (eqIndex === -1) return null;

  const name = nameValue.slice(0, eqIndex);
  const value = nameValue.slice(eqIndex + 1);

  const result: {
    name: string;
    value: string;
    httpOnly: boolean;
    maxAge?: number;
    path: string;
    sameSite: string;
    secure: boolean;
  } = {
    name,
    value,
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    secure: false,
  };

  for (const attr of attributes) {
    const lower = attr.toLowerCase();

    if (lower === "httponly") {
      result.httpOnly = true;
    } else if (lower === "secure") {
      result.secure = true;
    } else if (lower.startsWith("max-age=")) {
      result.maxAge = parseInt(attr.split("=")[1], 10);
    } else if (lower.startsWith("path=")) {
      result.path = attr.split("=")[1];
    } else if (lower.startsWith("samesite=")) {
      result.sameSite = attr.split("=")[1].toLowerCase();
    }
  }

  return result;
}
