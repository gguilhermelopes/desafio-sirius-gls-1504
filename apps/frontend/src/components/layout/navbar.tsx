import React from "react";
import { AuthUser } from "@juscash/shared";
import { UserMenu } from "./user-menu";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function Navbar({
  onToggleSidebar,
  user,
  userMenuMessages,
}: {
  onToggleSidebar: () => void;
  user: AuthUser;
  userMenuMessages: {
    error: string;
    logout: string;
  };
}) {
  return (
    <header className="col-span-full row-start-1 z-10 flex h-16 items-center justify-between border-b border-neutral-300 bg-neutral-50 px-4 max-md:px-3">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Expandir sidebar"
          className="flex h-8 w-8 items-center justify-center rounded-md border-none bg-transparent p-0 text-neutral-800 max-[430px]:h-7 max-[430px]:w-7"
          onClick={onToggleSidebar}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" />
          </svg>
        </button>
        <img
          alt="JusCash"
          className="block h-6 w-auto max-w-[124px] object-contain max-md:h-5 max-md:max-w-[108px]"
          src="/logos/logo-mobile.png"
          height="24"
          width="160"
        />
      </div>
      <div className="flex items-center gap-3 max-md:gap-1">
        <button
          aria-label="Notificações"
          className="flex h-8 w-8 items-center justify-center gap-1.5 rounded-md border-0 bg-transparent p-0 text-neutral-800 hover:bg-neutral-100"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.268 21a2 2 0 0 0 3.464 0" />
            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.674C19.41 13.956 18 12.499 18 8a6 6 0 1 0-12 0c0 4.499-1.411 5.956-2.738 7.326" />
          </svg>
        </button>
        <UserMenu
          initials={getInitials(user.name)}
          messages={userMenuMessages}
          userName={user.name}
        />
      </div>
    </header>
  );
}
