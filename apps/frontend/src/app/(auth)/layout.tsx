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
    <main className="min-h-screen bg-neutral-100 text-neutral-800 font-sans flex flex-col items-center py-[241px] max-[430px]:min-h-[932px] max-[430px]:py-[187px] max-[360px]:min-h-[640px] max-[360px]:py-[33px] lg:grid lg:grid-cols-[minmax(529px,1016px)_minmax(495px,904px)] lg:justify-center lg:items-stretch lg:py-0">
      {/* Hero image — lg+ only */}
      <section className="hidden lg:block lg:p-6 lg:pr-0">
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#072854]">
          <img
            alt=""
            className="relative z-[1] block h-full w-full object-cover"
            src="/img/image.png"
          />
          <div className="absolute inset-0 z-[2] bg-[#072854] mix-blend-hard-light" />
          <div className="absolute inset-0 z-[3] grid content-start gap-4 p-8">
            <img
              alt=""
              className="block w-[199px] h-[30px] object-contain"
              height="30"
              src="/logos/logo.png"
              width="200"
            />
            <p className="m-0 text-neutral-50 text-[13px] leading-[1.2]">
              {messages.auth.heroText}
            </p>
          </div>
        </div>
      </section>

      {/* Mobile brand — below lg */}
      <section className="grid gap-4 justify-items-center p-8 w-[calc(100%-64px)] max-w-[704px] max-[430px]:w-[366px] max-[430px]:max-w-[366px] max-[360px]:w-[296px] max-[360px]:max-w-[296px] lg:hidden">
        <img
          alt="JusCash"
          className="block h-[30px] w-[199px] object-contain"
          height="30"
          src="/logos/logo-mobile.png"
          width="200"
        />
        <p className="m-0 w-full text-neutral-800 text-center text-[13px] leading-[1.2] max-[360px]:leading-[1.23]">
          {messages.auth.heroText}
        </p>
      </section>

      {/* Card panel */}
      <section className="flex w-full items-center justify-center">
        <div className="w-[min(720px,calc(100%-48px))] grid justify-items-center gap-12 max-[430px]:w-[382px] max-[360px]:w-[312px] lg:w-[447px] min-[1201px]:w-[460px]">
          {children}
        </div>
      </section>
    </main>
  );
}
