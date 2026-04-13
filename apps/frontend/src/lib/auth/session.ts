const AUTHENTICATED_ROUTE_PREFIXES = ["/communications"];

export function isAuthenticatedRoute(pathname: string) {
  return AUTHENTICATED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
