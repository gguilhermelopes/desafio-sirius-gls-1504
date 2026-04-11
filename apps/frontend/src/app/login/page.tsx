import Link from "next/link";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default function LoginPage() {
  const messages = getMessages(DEFAULT_LOCALE);

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="auth-brand">{messages.common.appName}</span>
        <h1>{messages.auth.loginTitle}</h1>
        <p>{messages.auth.loginDescription}</p>
        <div aria-label="Login form shell" className="auth-form">
          <input aria-label="E-mail" type="email" />
          <input aria-label="Senha" type="password" />
          <button type="button">{messages.auth.loginButton}</button>
        </div>
        <Link href="/register">{messages.auth.registerLink}</Link>
      </section>
    </main>
  );
}
