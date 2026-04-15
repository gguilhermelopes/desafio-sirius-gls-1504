"use client";

import { useState } from "react";
import { ProcessCommunication } from "@juscash/shared";
import { TimelineEntry } from "./timeline-entry";
import { DetailPagination } from "./detail-pagination";

const ITEMS_PER_PAGE = 6;

export function CommunicationTimeline({
  communications,
  messages,
}: {
  communications: ProcessCommunication[];
  messages: {
    date: string;
    recipients: string;
    contentOfMovement: string;
    transitouEmJulgado: string;
    summarize: string;
    summaryModalTitle: string;
    summaryModalDescription: string;
    summaryModalClose: string;
    summaryLoading: string;
    summaryError: string;
    previous: string;
    next: string;
  };
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(communications.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const visible = communications.slice(start, start + ITEMS_PER_PAGE);

  return (
    <>
      <div className="flex flex-col gap-4">
        {visible.map((c) => (
          <TimelineEntry key={c.id} communication={c} messages={messages} />
        ))}
      </div>
      <DetailPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        previousLabel={messages.previous}
        nextLabel={messages.next}
      />
    </>
  );
}
