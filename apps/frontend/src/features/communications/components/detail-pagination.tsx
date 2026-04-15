"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DetailPagination({
  currentPage,
  totalPages,
  onPageChange,
  previousLabel,
  nextLabel,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  previousLabel: string;
  nextLabel: string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="mt-6 flex items-center justify-end gap-1"
      aria-label="Paginação"
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={clsx(
          "flex items-center justify-center gap-1.5 h-8 px-3 font-sans font-normal text-[13px] leading-none rounded-md border-0 bg-transparent cursor-pointer transition-colors",
          currentPage <= 1
            ? "text-neutral-300 pointer-events-none"
            : "text-neutral-800 hover:bg-neutral-100",
        )}
      >
        <ChevronLeft size={14} />
        {previousLabel}
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={clsx(
            "flex items-center justify-center w-8 h-8 font-sans font-normal text-[13px] leading-none rounded-md border cursor-pointer transition-colors",
            p === currentPage
              ? "border-neutral-300 bg-transparent text-neutral-800"
              : "border-transparent bg-transparent text-neutral-800 hover:bg-neutral-100",
          )}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={clsx(
          "flex items-center justify-center gap-1.5 h-8 px-3 font-sans font-normal text-[13px] leading-none rounded-md border-0 bg-transparent cursor-pointer transition-colors",
          currentPage >= totalPages
            ? "text-neutral-300 pointer-events-none"
            : "text-neutral-800 hover:bg-neutral-100",
        )}
      >
        {nextLabel}
        <ChevronRight size={14} />
      </button>
    </nav>
  );
}
