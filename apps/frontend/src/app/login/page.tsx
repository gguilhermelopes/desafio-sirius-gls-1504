import { redirect } from "next/navigation";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { getSession } from "@/lib/auth/get-session";

export default async function LoginPage() {
  if (await getSession()) {
    redirect("/communications");
  }

  const messages = getMessages(DEFAULT_LOCALE);

  return (
    <AuthShell
      subtitle={messages.auth.loginDescription}
      title={messages.auth.loginTitle}
    >
      <LoginForm messages={messages} />
    </AuthShell>
  );
}
