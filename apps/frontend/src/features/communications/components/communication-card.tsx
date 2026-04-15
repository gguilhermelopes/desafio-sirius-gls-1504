import React from "react";
import Link from "next/link";
import { CommunicationListItem } from "@juscash/shared";
import { Scale, Calendar, Gavel, Clock, Users, FileText } from "lucide-react";
import { SummarizeButton } from "./summarize-button";
import { FormattedCommunicationContent } from "./formatted-communication-content";

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("pt-BR");
}

export function CommunicationCard({
  item,
  messages,
}: {
  item: CommunicationListItem;
  messages: {
    process: string;
    date: string;
    tribunal: string;
    communicationType: string;
    recipients: string;
    content: string;
    summarize: string;
    summaryModalTitle: string;
    summaryModalDescription: string;
    summaryModalClose: string;
    summaryLoading: string;
    summaryError: string;
  };
}) {
  const recipientNames = item.recipients.map((r) => r.name).join(", ");

  return (
    <article className="mb-4 overflow-hidden rounded-md border border-neutral-300 bg-neutral-50 p-4 sm:p-6">
      {/* Top row: Processo + Data + Resumir */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <FieldLabel icon={<Scale size={14} />} label={messages.process} />
          <Link
            href={`/communications/${encodeURIComponent(item.process.number)}`}
            className="font-sans text-[16px] leading-[1.4] text-neutral-800 no-underline hover:underline"
          >
            {item.process.number}
            {item.process.className ? ` - ${item.process.className}` : ""}
          </Link>
        </div>

        <div className="flex items-start gap-4 max-sm:justify-between">
          <div className="sm:text-right">
            <FieldLabel icon={<Calendar size={14} />} label={messages.date} />
            <div className="font-sans text-[16px] leading-[1.4] text-neutral-800">
              {formatDate(item.publicationDate)}
            </div>
          </div>
          <SummarizeButton
            communicationId={item.id}
            cachedSummary={null}
            messages={messages}
          />
        </div>
      </div>

      {/* Tribunal + Tipo da comunicação */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2">
        <div>
          <FieldLabel icon={<Gavel size={14} />} label={messages.tribunal} />
          <div className="font-sans text-[16px] leading-[1.4] text-neutral-800">
            {item.process.tribunal.sigla}
          </div>
        </div>
        <div>
          <FieldLabel icon={<Clock size={14} />} label={messages.communicationType} />
          <div className="font-sans text-[16px] leading-[1.4] text-neutral-800">
            {item.type}
          </div>
        </div>
      </div>

      {/* Destinatários */}
      <div className="mb-4">
        <FieldLabel icon={<Users size={14} />} label={messages.recipients} />
        <div className="break-words font-sans text-[16px] leading-[1.4] text-neutral-800 line-clamp-2">
          {recipientNames || "—"}
        </div>
      </div>

      {/* Conteúdo */}
      <div>
        <FieldLabel icon={<FileText size={14} />} label={messages.content} />
        <p className="font-sans font-normal text-[16px] leading-[1.5] text-neutral-800 line-clamp-3 m-0">
          <FormattedCommunicationContent content={item.content} />
        </p>
      </div>
    </article>
  );
}

function FieldLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="mb-0.5 flex items-center gap-1.5 font-sans text-[13px] font-bold leading-[1.2] text-neutral-muted">
      {icon}
      <span>{label}</span>
    </div>
  );
}
