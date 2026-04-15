import { LoginForm } from "@/features/auth/components/login-form";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default function LoginPage() {
  const messages = getMessages(DEFAULT_LOCALE);

  return (
    <>
      <article className="w-full grid gap-4 p-6 border border-neutral-300 rounded-md bg-neutral-50 shadow-subtle">
        <header className="grid gap-4">
          <h1 className="m-0 text-neutral-800 text-[25px] font-bold leading-[1.2] text-center">
            {messages.auth.loginTitle}
          </h1>
          <p className="m-0 text-neutral-muted text-center text-[13px] leading-[1.2]">
            {messages.auth.loginDescription}
          </p>
        </header>
        <LoginForm messages={messages} />
      </article>
      <p className="m-0 w-full text-neutral-muted text-center text-[13px] leading-[1.2]">
        {messages.auth.legalText}
      </p>
    </>
  );
}
