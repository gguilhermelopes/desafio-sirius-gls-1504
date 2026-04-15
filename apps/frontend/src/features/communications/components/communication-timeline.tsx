import { ProcessCommunication } from "@juscash/shared";
import { TimelineEntry } from "./timeline-entry";

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
  };
}) {
  return (
    <div className="divide-y divide-neutral-300">
      {communications.map((c) => (
        <TimelineEntry key={c.id} communication={c} messages={messages} />
      ))}
    </div>
  );
}
