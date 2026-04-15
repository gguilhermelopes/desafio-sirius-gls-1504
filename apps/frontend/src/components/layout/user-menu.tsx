"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "../../features/auth/actions/logout";

export function UserMenu({
  forceOpen = false,
  initials,
  messages,
  userName,
}: {
  forceOpen?: boolean;
  initials: string;
  messages: {
    error: string;
    logout: string;
  };
  userName: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(forceOpen);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (!open) {
      return;
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function handleLogout() {
    setSubmitting(true);
    setError(null);

    const result = await logoutAction();

    if (!result.success) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setOpen(false);
    window.location.assign("/login");
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={userName}
        className="flex cursor-pointer items-center justify-center gap-1.5 border-0 bg-transparent p-0 text-neutral-800 hover:bg-neutral-100"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 font-sans text-[13px] font-bold leading-none text-neutral-800 max-[430px]:h-7 max-[430px]:w-7 max-[430px]:text-xs">
          {initials}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div
          aria-label={`Menu do usuário ${userName}`}
          className="absolute right-0 top-[calc(100%+8px)] z-20 grid min-w-[220px] gap-2 rounded-lg border border-neutral-300 bg-neutral-50 p-3 shadow-[0_12px_30px_rgba(23,23,23,0.12)] max-md:max-w-[calc(100vw-24px)] max-md:min-w-[180px]"
          role="menu"
        >
          <div className="break-words font-sans text-[13px] font-semibold leading-[1.4] text-neutral-800">
            {userName}
          </div>
          <button
            className="w-full cursor-pointer rounded-md border-0 bg-neutral-100 px-3 py-2.5 text-left font-sans text-[13px] font-normal leading-[1.2] text-neutral-800 hover:bg-[#ececec] disabled:cursor-wait disabled:opacity-60"
            disabled={submitting}
            onClick={handleLogout}
            role="menuitem"
            type="button"
          >
            {submitting ? `${messages.logout}...` : messages.logout}
          </button>
          {error ? (
            <p className="m-0 font-sans text-[13px] font-normal leading-[1.4] text-[#9d231c]" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
