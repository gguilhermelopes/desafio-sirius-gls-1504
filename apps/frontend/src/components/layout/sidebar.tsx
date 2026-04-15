"use client";

import React from "react";
import clsx from "clsx";
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

export function Sidebar({ expanded }: { expanded: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Menu principal"
      className={clsx(
        "col-start-1 row-start-2 overflow-hidden border-r border-neutral-300 bg-neutral-50 p-3 max-md:hidden",
        expanded ? "w-[232px]" : "w-[72px]"
      )}
    >
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {MENU_ITEMS.map((item, index) => {
          const isActive = index === 0 && pathname.startsWith("/communications");
          return (
            <li key={index}>
              <Link
                href={item.href}
                className={clsx(
                  "flex h-9 w-full items-center gap-3 rounded-md px-3 text-neutral-800 no-underline hover:bg-neutral-100",
                  !expanded && "justify-center px-0",
                  isActive && "bg-neutral-100 font-semibold"
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="inline-flex w-4 shrink-0 items-center justify-center">{item.icon}</span>
                {expanded && (
                  <span className="whitespace-nowrap font-sans text-[13px] font-medium leading-[1.2]">{item.label}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
