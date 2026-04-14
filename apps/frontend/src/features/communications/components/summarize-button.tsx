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
      <button className="proc-timeline-btn" onClick={handleClick} type="button">
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
