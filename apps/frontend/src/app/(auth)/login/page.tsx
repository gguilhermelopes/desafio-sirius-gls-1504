import { LoginForm } from "@/features/auth/components/login-form";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default function LoginPage() {
  const messages = getMessages(DEFAULT_LOCALE);

  return (
    <>
      <article className="login-card">
        <header className="login-card-header">
          <h1>{messages.auth.loginTitle}</h1>
          <p>{messages.auth.loginDescription}</p>
        </header>
        <LoginForm messages={messages} />
      </article>
      <p className="login-legal">{messages.auth.legalText}</p>
    </>
  );
}
