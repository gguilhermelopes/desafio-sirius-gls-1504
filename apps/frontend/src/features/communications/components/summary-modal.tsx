"use client";

import React from "react";
import { Modal } from "../../../components/ui/modal";

export function SummaryModal({
  open,
  onClose,
  summary,
  loading,
  error,
  messages,
}: {
  open: boolean;
  onClose: () => void;
  summary: string | null;
  loading: boolean;
  error: string | null;
  messages: {
    summaryModalTitle: string;
    summaryModalDescription: string;
    summaryModalClose: string;
    summaryLoading: string;
  };
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="font-bold text-[20px] leading-[1.2] font-sans text-neutral-800 m-0 mb-2">{messages.summaryModalTitle}</h2>
      <p className="font-normal text-[13px] leading-[1.4] font-sans text-neutral-muted m-0 mb-6">{messages.summaryModalDescription}</p>
      <div className="font-normal text-[16px] leading-[1.5] font-sans text-neutral-800 mb-6">
        {loading && <p>{messages.summaryLoading}</p>}
        {error && <p className="text-red-700">{error}</p>}
        {summary && <p>{summary}</p>}
      </div>
      <div className="flex justify-end">
        <button className="font-normal text-[13px] leading-[1.2] font-sans text-neutral-800 bg-transparent border border-neutral-300 rounded-md py-2 px-4 cursor-pointer hover:bg-neutral-100" onClick={onClose} type="button">
          {messages.summaryModalClose}
        </button>
      </div>
    </Modal>
  );
}
