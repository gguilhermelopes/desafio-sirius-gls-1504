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
    <main className="min-h-screen bg-neutral-100 font-sans text-neutral-800 lg:grid lg:grid-cols-[minmax(0,1016px)_minmax(0,904px)]">
      <section className="hidden lg:flex lg:justify-end" aria-hidden="true">
        <div className="h-[calc(100vh-48px)] min-h-[720px] w-full px-6 py-6">
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#072854]">
            <div className="absolute left-[-52%] top-[-98%] h-[228%] w-[242%] rounded-full bg-[#072854]" />
          <img
            alt=""
            className="block h-full w-full object-cover"
            src="/img/image.png"
          />
            <div className="absolute inset-0 grid content-start gap-4 p-8">
              <img
                alt=""
                className="block h-[30px] w-[199px] object-contain"
                height="30"
                src="/logos/logo.png"
                width="200"
              />
              <p className="m-0 text-[13px] leading-[1.2] text-neutral-50">{heroText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 px-8 py-8 text-center lg:hidden">
        <img
          alt="JusCash"
          className="block h-[30px] w-[199px] max-w-full object-contain"
          height="30"
          src="/logos/logo-mobile.png"
          width="200"
        />
        <p className="m-0 max-w-[296px] text-[13px] leading-[1.2] text-neutral-800">{heroText}</p>
      </section>

      <section className="flex flex-1 items-start justify-center px-6 pb-8 lg:items-center lg:px-0 lg:pb-0">
        <div className="grid w-full max-w-[312px] justify-items-center gap-12 sm:max-w-[460px] lg:max-w-[460px]">
          <article className="w-full grid gap-4 p-6 border border-neutral-300 rounded-md bg-neutral-50 shadow-subtle">
            <header className="grid gap-4">
              <h1 className="m-0 text-neutral-800 text-[25px] font-bold leading-[1.2] text-center">{title}</h1>
              <p className="m-0 text-neutral-muted text-center text-[13px] leading-[1.2]">{subtitle}</p>
            </header>
            {children}
          </article>
          <p className="m-0 w-full px-6 text-center text-[13px] leading-[1.2] text-neutral-muted sm:px-0">{footerText}</p>
        </div>
      </section>
    </main>
  );
}
