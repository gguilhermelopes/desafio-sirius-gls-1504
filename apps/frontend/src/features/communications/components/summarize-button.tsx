"use client";

import { useState } from "react";
import { getSummary } from "../actions/get-summary";
import { SummaryModal } from "./summary-modal";

export function SummarizeButton({
  communicationId,
  cachedSummary,
  messages,
}: {
  communicationId: string;
  cachedSummary: string | null;
  messages: {
    summarize: string;
    summaryModalTitle: string;
    summaryModalDescription: string;
    summaryModalClose: string;
    summaryLoading: string;
    summaryError: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(cachedSummary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setOpen(true);

    if (summary) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getSummary(communicationId);
      setSummary(result.summary);
    } catch {
      setError(messages.summaryError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="flex items-center gap-1.5 shrink-0 font-sans font-normal text-[13px] leading-[1.2] text-neutral-800 bg-transparent border border-neutral-300 rounded-md px-3 py-1.5 cursor-pointer transition-colors hover:bg-neutral-100 hover:border-neutral-800"
        onClick={handleClick}
        type="button"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
          <path d="M20 3v4" /><path d="M22 5h-4" />
        </svg>
        {messages.summarize}
      </button>
      <SummaryModal
        open={open}
        onClose={() => setOpen(false)}
        summary={summary}
        loading={loading}
        error={error}
        messages={messages}
      />
    </>
  );
}
