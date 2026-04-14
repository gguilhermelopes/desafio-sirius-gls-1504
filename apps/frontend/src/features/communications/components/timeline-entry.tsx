import { ProcessCommunication } from "@juscash/shared";
import { HighlightTransitado } from "./highlight-transitado";
import { SummarizeButton } from "./summarize-button";

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("pt-BR");
}

export function TimelineEntry({
  communication,
  messages,
}: {
  communication: ProcessCommunication;
  messages: {
    date: string;
    recipients: string;
    contentOfMovement: string;
    summarize: string;
    summaryModalTitle: string;
    summaryModalDescription: string;
    summaryModalClose: string;
    summaryLoading: string;
    summaryError: string;
  };
}) {
  const recipientNames = communication.recipients.map((r) => r.name).join(", ");

  return (
    <article className="proc-timeline-entry">
      <div className="proc-timeline-field">
        <div className="proc-timeline-label">{messages.date}</div>
        <div className="proc-timeline-value">{formatDate(communication.publicationDate)}</div>
      </div>
      <div className="proc-timeline-field">
        <div className="proc-timeline-label">{messages.recipients}</div>
        <div className="proc-timeline-value">{recipientNames || "—"}</div>
      </div>
      <div className="proc-timeline-field">
        <div className="proc-timeline-label">{messages.contentOfMovement}</div>
        <div className="proc-timeline-value">
          <HighlightTransitado text={communication.content} />
        </div>
      </div>
      <div className="proc-timeline-actions">
        <SummarizeButton
          communicationId={communication.id}
          cachedSummary={communication.aiSummary}
          messages={messages}
        />
      </div>
    </article>
  );
}
