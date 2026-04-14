import { RegisterForm } from "@/features/auth/components/register-form";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default function RegisterPage() {
  const messages = getMessages(DEFAULT_LOCALE);

  return (
    <>
      <article className="login-card">
        <header className="login-card-header">
          <h1>{messages.auth.registerTitle}</h1>
          <p>{messages.auth.registerDescription}</p>
        </header>
        <RegisterForm messages={messages} />
      </article>
      <p className="login-legal">{messages.auth.legalText}</p>
    </>
  );
}
