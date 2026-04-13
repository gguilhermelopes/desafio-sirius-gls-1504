import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";
import { LoginShell } from "@/features/auth/components/login-shell";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { getSession } from "@/lib/auth/get-session";

export default async function LoginPage() {
  if (await getSession()) {
    redirect("/communications");
  }

  const messages = getMessages(DEFAULT_LOCALE);

  return (
    <LoginShell
      footerText={messages.auth.legalText}
      heroText={messages.auth.heroText}
      subtitle={messages.auth.loginDescription}
      title={messages.auth.loginTitle}
    >
      <LoginForm messages={messages} />
    </LoginShell>
  );
}
