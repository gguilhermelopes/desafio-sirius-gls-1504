type AuthShellProps = {
  children: React.ReactNode;
  subtitle: string;
  title: string;
};

export function AuthShell({ children, subtitle, title }: AuthShellProps) {
  return (
    <main className="auth-page">
      <section className="auth-hero" aria-hidden="true">
        <div className="auth-hero-content">
          <span className="auth-brand">JusCash</span>
          <h2 className="auth-hero-title">Jurimetria com contexto operacional.</h2>
          <p className="auth-hero-text">
            Centralize autenticação, sessões seguras e o acompanhamento das
            comunicações em uma base preparada para crescer.
          </p>
        </div>
      </section>

      <section className="auth-panel">
        <article className="auth-card">
          <span className="auth-brand auth-brand-mobile">JusCash</span>
          <header className="auth-card-header">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </header>
          {children}
        </article>
      </section>
    </main>
  );
}
