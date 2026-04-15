import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const messages = getMessages(DEFAULT_LOCALE);

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardShell
      user={session}
      userMenuMessages={{
        error: messages.common.userMenuError,
        logout: messages.common.userMenuLogout,
      }}
    >
      {children}
    </DashboardShell>
  );
}
