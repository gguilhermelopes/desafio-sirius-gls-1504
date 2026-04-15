import Link from "next/link";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default function ProcessNotFound() {
  const messages = getMessages(DEFAULT_LOCALE);

  return (
    <div className="flex flex-col items-center py-16 px-6">
      <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-neutral-200 mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6d6d6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
          <path d="M8 11h6" />
        </svg>
      </div>
      <h1 className="font-sans font-bold text-lg leading-[1.2] text-neutral-800 m-0 mb-2 text-center">
        {messages.common.processNotFoundTitle}
      </h1>
      <p className="font-sans text-[14px] leading-[1.5] text-neutral-muted m-0 mb-6 text-center max-w-[400px]">
        {messages.common.processNotFoundDescription}
      </p>
      <Link
        href="/communications"
        className="font-sans text-[13px] font-medium leading-[1.2] text-neutral-50 bg-neutral-800 rounded-md px-4 py-2.5 no-underline hover:bg-neutral-700 transition-colors"
      >
        {messages.common.processNotFoundAction}
      </Link>
    </div>
  );
}
