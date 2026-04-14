import { ProcessDetailResponse } from "@juscash/shared";

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
    <div className="proc-header">
      <div className="proc-header-top">
        <div>
          <h1 className="proc-header-title">
            {data.process.number}
            {data.process.className ? ` - ${data.process.className}` : ""}
          </h1>
          <div className="proc-header-info">
            <span className="proc-header-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>
              {data.process.tribunal.sigla}
            </span>
            <span className="proc-header-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              {data.recipients.join(", ")}
            </span>
            <span className="proc-header-chip">
              {data.process.communicationsCount} {messages.updates}
            </span>
          </div>
        </div>
        {data.process.hasTransitado && (
          <span className="proc-badge-transitado">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
            {messages.transitouEmJulgado}
          </span>
        )}
      </div>
    </div>
  );
}
