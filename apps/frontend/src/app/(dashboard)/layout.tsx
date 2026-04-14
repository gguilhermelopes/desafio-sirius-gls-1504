import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="dash-layout">
      <Navbar user={session} />
      <Sidebar />
      <main className="dash-main">{children}</main>
    </div>
  );
}
