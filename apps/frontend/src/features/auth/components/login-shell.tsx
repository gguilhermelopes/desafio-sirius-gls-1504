import React from "react";

type LoginShellProps = {
  children: React.ReactNode;
  footerText: string;
  heroText: string;
  subtitle: string;
  title: string;
};

export function LoginShell({
  children,
  footerText,
  heroText,
  subtitle,
  title,
}: LoginShellProps) {
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
            <p className="login-media-text">{heroText}</p>
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
        <p className="login-mobile-brand-text">{heroText}</p>
      </section>

      <section className="login-panel">
        <div className="login-panel-inner">
          <article className="login-card">
            <header className="login-card-header">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </header>
            {children}
          </article>
          <p className="login-legal">{footerText}</p>
        </div>
      </section>
    </main>
  );
}
