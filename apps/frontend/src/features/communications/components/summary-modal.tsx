"use client";

import { Modal } from "@/components/ui/modal";

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
      <h2 className="modal-title">{messages.summaryModalTitle}</h2>
      <p className="modal-description">{messages.summaryModalDescription}</p>
      <div className="modal-content">
        {loading && <p>{messages.summaryLoading}</p>}
        {error && <p style={{ color: "#9d231c" }}>{error}</p>}
        {summary && <p>{summary}</p>}
      </div>
      <div className="modal-footer">
        <button className="modal-close-btn" onClick={onClose} type="button">
          {messages.summaryModalClose}
        </button>
      </div>
    </Modal>
  );
}
