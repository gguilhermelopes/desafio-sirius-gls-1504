import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { getSession } from "@/lib/auth/get-session";

export default async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (await getSession()) {
    redirect("/communications");
  }

  const messages = getMessages(DEFAULT_LOCALE);

  return (
    <main className="login-layout">
      <section className="login-media" aria-hidden="true">
        <div className="login-media-frame">
          <img
            alt=""
            className="login-media-image"
            src="/img/image.png"
          />
          <div className="login-media-overlay" />
          <div className="login-media-content">
            <img
              alt=""
              className="login-logo login-logo-hero"
              height="30"
              src="/logos/logo.png"
              width="200"
            />
            <p className="login-media-text">{messages.auth.heroText}</p>
          </div>
        </div>
      </section>

      <section className="login-mobile-brand">
        <img
          alt="JusCash"
          className="login-logo login-logo-mobile"
          height="30"
          src="/logos/logo-mobile.png"
          width="200"
        />
        <p className="login-mobile-brand-text">{messages.auth.heroText}</p>
      </section>

      <section className="login-panel">
        <div className="login-panel-inner">
          {children}
        </div>
      </section>
    </main>
  );
}
