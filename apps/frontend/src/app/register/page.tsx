import { redirect } from "next/navigation";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { getSession } from "@/lib/auth/get-session";

export default async function RegisterPage() {
  if (await getSession()) {
    redirect("/communications");
  }

  const messages = getMessages(DEFAULT_LOCALE);

  return (
    <AuthShell
      subtitle={messages.auth.registerDescription}
      title={messages.auth.registerTitle}
    >
      <RegisterForm messages={messages} />
    </AuthShell>
  );
}
