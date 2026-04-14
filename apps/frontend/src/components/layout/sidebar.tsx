"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  {
    href: "/communications",
    label: "Início",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    href: "/communications",
    label: "Comunicações",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
        <path d="m21.854 2.147-10.94 10.939" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="dash-sidebar" aria-label="Menu principal">
      <ul className="dash-sidebar-list">
        {MENU_ITEMS.map((item, index) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <li key={index}>
              <Link
                href={item.href}
                className={`dash-sidebar-item${isActive ? " is-active" : ""}`}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                {item.icon}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
