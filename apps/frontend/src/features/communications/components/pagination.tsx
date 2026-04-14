import Link from "next/link";
import { PaginationMeta } from "@juscash/shared";

function buildHref(
  searchParams: Record<string, string | undefined>,
  page: number,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value) params.set(key, value);
  }
  params.set("page", String(page));
  return `/communications?${params.toString()}`;
}

export function Pagination({
  meta,
  searchParams,
  previousLabel,
  nextLabel,
}: {
  meta: PaginationMeta;
  searchParams: Record<string, string | undefined>;
  previousLabel: string;
  nextLabel: string;
}) {
  if (meta.totalPages <= 1) return null;

  const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1);

  return (
    <nav className="comm-pagination" aria-label="Paginação">
      {meta.page > 1 ? (
        <Link href={buildHref(searchParams, meta.page - 1)} className="comm-pagination-btn">
          {previousLabel}
        </Link>
      ) : (
        <span className="comm-pagination-btn is-disabled">{previousLabel}</span>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(searchParams, p)}
          className={`comm-pagination-page${p === meta.page ? " is-active" : ""}`}
          aria-current={p === meta.page ? "page" : undefined}
        >
          {p}
        </Link>
      ))}

      {meta.page < meta.totalPages ? (
        <Link href={buildHref(searchParams, meta.page + 1)} className="comm-pagination-btn">
          {nextLabel}
        </Link>
      ) : (
        <span className="comm-pagination-btn is-disabled">{nextLabel}</span>
      )}
    </nav>
  );
}
