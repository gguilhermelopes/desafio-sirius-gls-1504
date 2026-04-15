"use client";

import React from "react";
import clsx from "clsx";
import { AuthUser } from "@juscash/shared";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

export function DashboardShell({
  children,
  user,
  userMenuMessages,
}: {
  children: React.ReactNode;
  user: AuthUser;
  userMenuMessages: {
    error: string;
    logout: string;
  };
}) {
  return (
    <div
      className={clsx(
        "grid min-h-screen grid-rows-[64px_1fr]",
        "max-md:grid-cols-[1fr]",
        "md:grid-cols-[72px_1fr]"
      )}
    >
      <Navbar
        onToggleSidebar={() => {}}
        user={user}
        userMenuMessages={userMenuMessages}
      />
      <Sidebar expanded={false} />
      <main className="col-start-2 row-start-2 overflow-y-auto bg-neutral-100 p-6 max-lg:p-4 max-md:col-start-1 max-md:p-3">
        {children}
      </main>
    </div>
  );
}
