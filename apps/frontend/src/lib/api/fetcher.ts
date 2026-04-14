const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const INTERNAL_API_URL = process.env.INTERNAL_API_URL;
const API_URL =
  typeof window === "undefined"
    ? INTERNAL_API_URL || PUBLIC_API_URL
    : PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const body = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(body), response.status);
  }

  return body as T;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function extractErrorMessage(body: unknown) {
  if (!body) {
    return "Request failed";
  }

  if (typeof body === "string") {
    return body;
  }

  if (typeof body === "object" && body !== null && "message" in body) {
    const message = (body as { message?: unknown }).message;

    if (Array.isArray(message) && message.length > 0) {
      const firstMessage = message[0];
      return typeof firstMessage === "string" ? firstMessage : "Request failed";
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Request failed";
}
