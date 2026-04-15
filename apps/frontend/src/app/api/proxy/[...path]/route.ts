import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { buildCookieHeader } from "@/lib/auth/get-session";

const INTERNAL_API_URL = process.env.INTERNAL_API_URL;
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = INTERNAL_API_URL || PUBLIC_API_URL;

async function proxyRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  if (!API_URL) {
    return NextResponse.json({ message: "API URL not configured" }, { status: 500 });
  }

  const { path } = await params;
  const targetPath = `/${path.join("/")}`;
  const url = new URL(request.url);
  const queryString = url.searchParams.toString();
  const targetUrl = `${API_URL}${targetPath}${queryString ? `?${queryString}` : ""}`;

  const cookieStore = await cookies();
  const cookieHeader = buildCookieHeader(cookieStore.getAll());

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  const body = request.method !== "GET" && request.method !== "HEAD"
    ? await request.text()
    : undefined;

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });

  const responseBody = await response.text();

  return new NextResponse(responseBody || null, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
