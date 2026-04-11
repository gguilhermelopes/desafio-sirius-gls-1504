import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JusCash",
  description: "Technical case scaffold for judicial communications."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
