import Link from "next/link";

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="proc-breadcrumb" aria-label="Navegação">
      {items.map((item, index) => (
        <span key={index}>
          {index > 0 && <span className="proc-breadcrumb-separator"> &gt; </span>}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className="proc-breadcrumb-current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
