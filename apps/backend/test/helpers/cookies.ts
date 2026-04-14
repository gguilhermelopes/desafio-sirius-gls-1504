export function getSetCookieHeaders(
  setCookie: string | string[] | undefined,
): string[] {
  if (!setCookie) {
    return [];
  }

  return Array.isArray(setCookie) ? setCookie : [setCookie];
}

export function toCookieHeader(setCookieHeaders: string[]): string {
  return setCookieHeaders.map((cookie) => cookie.split(';', 1)[0]).join('; ');
}
