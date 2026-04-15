"use client";

import { DEFAULT_LOCALE } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  const messages = getMessages(DEFAULT_LOCALE);

  return (
    <div className="flex flex-col items-center py-16 px-6">
      <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-red-100 mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9d231c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      </div>
      <h1 className="font-sans font-bold text-lg leading-[1.2] text-neutral-800 m-0 mb-2 text-center">
        {messages.common.errorTitle}
      </h1>
      <p className="font-sans text-[14px] leading-[1.5] text-neutral-muted m-0 mb-6 text-center max-w-[400px]" role="alert">
        {messages.common.errorDescription}
      </p>
      <button
        onClick={reset}
        type="button"
        className="font-sans text-[13px] font-medium leading-[1.2] text-neutral-50 bg-neutral-800 rounded-md px-4 py-2.5 border-0 cursor-pointer hover:bg-neutral-700 transition-colors"
      >
        {messages.common.errorAction}
      </button>
    </div>
  );
}
