import React from "react";
import Link from "next/link";
import clsx from "clsx";
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

  const pages = buildVisiblePages(meta.page, meta.totalPages);

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-1" aria-label="Paginação">
      {meta.page > 1 ? (
        <Link
          href={buildHref(searchParams, meta.page - 1)}
          className="flex items-center justify-center gap-1.5 h-9 px-3 font-sans font-normal text-sm leading-none text-neutral-800 bg-transparent rounded-md no-underline cursor-pointer transition-colors hover:bg-neutral-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {previousLabel}
        </Link>
      ) : (
        <span className="flex items-center justify-center gap-1.5 h-9 px-3 font-sans font-normal text-sm leading-none text-neutral-300 bg-transparent rounded-md no-underline pointer-events-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {previousLabel}
        </span>
      )}

      {pages.map((p, index) => (
        typeof p === "number" ? (
          <Link
            key={p}
            href={buildHref(searchParams, p)}
            className={clsx(
              "flex items-center border border-neutral-300 justify-center w-9 h-9 font-sans font-normal text-sm leading-none no-underline rounded-md transition-colors",
              p === meta.page
                ? "bg-neutral-200 text-neutral-50"
                : "text-neutral-800 bg-transparent hover:bg-neutral-100"
            )}
            aria-current={p === meta.page ? "page" : undefined}
          >
            {p}
          </Link>
        ) : (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="inline-flex items-center justify-center w-6 text-neutral-muted font-sans font-normal text-sm leading-none"
          >
            ...
          </span>
        )
      ))}

      {meta.page < meta.totalPages ? (
        <Link
          href={buildHref(searchParams, meta.page + 1)}
          className="flex items-center justify-center gap-1.5 h-9 px-3 font-sans font-normal text-sm leading-none text-neutral-800 bg-transparent rounded-md no-underline cursor-pointer transition-colors hover:bg-neutral-100"
        >
          {nextLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      ) : (
        <span className="flex items-center justify-center gap-1.5 h-9 px-3 font-sans font-normal text-sm leading-none text-neutral-300 bg-transparent rounded-md no-underline pointer-events-none">
          {nextLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </span>
      )}
    </nav>
  );
}

function buildVisiblePages(
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const visible = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  if (currentPage <= 3) {
    visible.add(2);
    visible.add(3);
    visible.add(4);
  }
  if (currentPage >= totalPages - 2) {
    visible.add(totalPages - 1);
    visible.add(totalPages - 2);
    visible.add(totalPages - 3);
  }

  const pages = Array.from(visible)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);

  const result: Array<number | "ellipsis"> = [];
  for (const page of pages) {
    const previous = result[result.length - 1];
    if (typeof previous === "number" && page - previous > 1) {
      result.push("ellipsis");
    }
    result.push(page);
  }

  return result;
}
