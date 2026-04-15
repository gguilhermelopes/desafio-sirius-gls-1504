import { ProcessCommunication } from "@juscash/shared";
import { Calendar, Users, FileText } from "lucide-react";
import { HighlightTransitado } from "./highlight-transitado";
import { SummarizeButton } from "./summarize-button";

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("pt-BR");
}

function hasTransitadoContent(content: string): boolean {
  return /transitou em julgado/i.test(content);
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
    transitouEmJulgado: string;
    summarize: string;
    summaryModalTitle: string;
    summaryModalDescription: string;
    summaryModalClose: string;
    summaryLoading: string;
    summaryError: string;
  };
}) {
  const recipientNames = communication.recipients.map((r) => r.name).join(", ");
  const showTransitado = hasTransitadoContent(communication.content);

  return (
    <article className="py-5 sm:py-6">
      {/* Top row: Data + Transitado badge + Resumir */}
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-0.5 flex items-center gap-1.5 font-sans text-[13px] font-bold leading-[1.2] text-neutral-muted">
            <Calendar size={14} />
            <span>{messages.date}</span>
          </div>
          <div className="font-sans font-normal text-[16px] leading-[1.4] text-neutral-800">
            {formatDate(communication.publicationDate)}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showTransitado && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#fef2ec] rounded-md font-sans font-normal text-[13px] leading-[1.2] text-[#9d231c] whitespace-nowrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              {messages.transitouEmJulgado}
            </span>
          )}
          <SummarizeButton
            communicationId={communication.id}
            cachedSummary={communication.aiSummary}
            messages={messages}
          />
        </div>
      </div>

      {/* Destinatários */}
      <div className="mb-3">
        <div className="mb-0.5 flex items-center gap-1.5 font-sans text-[13px] font-bold leading-[1.2] text-neutral-muted">
          <Users size={14} />
          <span>{messages.recipients}</span>
        </div>
        <div className="font-sans font-normal text-[16px] leading-[1.4] text-neutral-800">
          {recipientNames || "—"}
        </div>
      </div>

      {/* Conteúdo da movimentação */}
      <div>
        <div className="mb-0.5 flex items-center gap-1.5 font-sans text-[13px] font-bold leading-[1.2] text-neutral-muted">
          <FileText size={14} />
          <span>{messages.contentOfMovement}</span>
        </div>
        <div className="font-sans font-normal text-[16px] leading-[1.5] text-neutral-800">
          <HighlightTransitado text={communication.content} />
        </div>
      </div>
    </article>
  );
}
