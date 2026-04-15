"use client";

import React from "react";
import { X } from "lucide-react";
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
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-0">
        <div>
          <h2 className="font-bold text-[20px] leading-[1.2] font-sans text-neutral-800 m-0 mb-1">
            {messages.summaryModalTitle}
          </h2>
          <p className="font-normal text-[13px] leading-[1.4] font-sans text-neutral-muted m-0">
            {messages.summaryModalDescription}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center shrink-0 w-8 h-8 rounded-md border-0 bg-transparent text-neutral-muted cursor-pointer hover:bg-neutral-100 hover:text-neutral-800"
          aria-label="Fechar"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 font-normal text-[16px] leading-[1.5] font-sans text-neutral-800">
        {loading && <p className="m-0">{messages.summaryLoading}</p>}
        {error && <p className="m-0 text-red-700">{error}</p>}
        {summary && <p className="m-0 whitespace-pre-line">{summary}</p>}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 border-t border-neutral-300 px-6 py-6">
        <button
          type="button"
          onClick={onClose}
          className="font-normal text-[13px] leading-[1.2] font-sans text-neutral-800 bg-transparent border border-neutral-300 rounded-md py-2 px-4 cursor-pointer hover:bg-neutral-100"
        >
          {messages.summaryModalClose}
        </button>
      </div>
    </Modal>
  );
}
