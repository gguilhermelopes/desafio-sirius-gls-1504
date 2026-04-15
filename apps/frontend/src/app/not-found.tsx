import Link from "next/link";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default function NotFound() {
  const messages = getMessages(DEFAULT_LOCALE);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-neutral-200 mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6d6d6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v.01" />
          <path d="M12 8v4" />
        </svg>
      </div>
      <h1 className="font-sans font-bold text-xl leading-[1.2] text-neutral-800 m-0 mb-2 text-center">
        {messages.common.notFoundTitle}
      </h1>
      <p className="font-sans text-[14px] leading-[1.5] text-neutral-muted m-0 mb-6 text-center max-w-[400px]">
        {messages.common.notFoundDescription}
      </p>
      <Link
        href="/communications"
        className="font-sans text-[13px] font-medium leading-[1.2] text-neutral-50 bg-neutral-800 rounded-md px-4 py-2.5 no-underline hover:bg-neutral-700 transition-colors"
      >
        {messages.common.notFoundAction}
      </Link>
    </div>
  );
}
