import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav
      className="flex items-center gap-1.5 font-normal text-[13px] leading-[1.2] font-sans text-neutral-muted mb-4"
      aria-label="Navegação"
    >
      {items.map((item, index) => (
        <span key={index} className="inline-flex items-center gap-1.5">
          {index > 0 && (
            <ChevronRight size={14} className="text-neutral-muted shrink-0" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-neutral-muted no-underline hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-neutral-800">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
