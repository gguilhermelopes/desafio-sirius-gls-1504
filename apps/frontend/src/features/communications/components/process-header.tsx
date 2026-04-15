import { ProcessDetailResponse } from "@juscash/shared";
import { Gavel, Users, Clock } from "lucide-react";

export function ProcessHeader({
  data,
  messages,
}: {
  data: ProcessDetailResponse;
  messages: {
    tribunal: string;
    recipients: string;
    updates: string;
    transitouEmJulgado: string;
  };
}) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h1 className="font-sans font-bold text-[20px] leading-[1.2] text-neutral-800 m-0">
          {data.process.number}
          {data.process.className ? ` - ${data.process.className}` : ""}
        </h1>
        {data.process.hasTransitado && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#fef2ec] rounded-md font-sans font-normal text-[13px] leading-[1.2] text-[#9d231c] whitespace-nowrap shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            {messages.transitouEmJulgado}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap font-sans font-normal text-[16px] leading-[1.2] text-neutral-800">
        <span className="inline-flex items-center gap-1.5 [&>svg]:text-neutral-muted">
          <Gavel size={16} />
          {data.process.tribunal.sigla}
        </span>
        <span className="text-neutral-300">|</span>
        <span className="inline-flex items-center gap-1.5 [&>svg]:text-neutral-muted">
          <Users size={16} />
          {data.recipients.join(", ")}
        </span>
        <span className="text-neutral-300">|</span>
        <span className="inline-flex items-center gap-1.5 [&>svg]:text-neutral-muted">
          <Clock size={16} />
          {data.process.communicationsCount} {messages.updates}
        </span>
      </div>
    </div>
  );
}
