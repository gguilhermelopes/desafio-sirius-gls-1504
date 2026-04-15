import Link from "next/link";

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="flex items-center gap-2 font-normal text-[13px] leading-[1.2] font-sans text-neutral-muted mb-4" aria-label="Navegação">
      {items.map((item, index) => (
        <span key={index}>
          {index > 0 && <span className="text-neutral-300"> &gt; </span>}
          {item.href ? (
            <Link href={item.href} className="text-neutral-muted no-underline hover:underline">{item.label}</Link>
          ) : (
            <span className="font-bold text-neutral-800">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
