import { NextRequest, NextResponse } from "next/server";

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const INTERNAL_API_URL = process.env.INTERNAL_API_URL;
const API_URL = INTERNAL_API_URL || PUBLIC_API_URL;

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (accessToken) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken || !API_URL) {
    return NextResponse.next();
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.next();
    }

    const nextResponse = NextResponse.next();

    for (const header of response.headers.getSetCookie()) {
      nextResponse.headers.append("Set-Cookie", header);
    }

    return nextResponse;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!login|register|api/|_next/|favicon.ico|.*\\..*).*)"],
};
