import Link from "next/link";
import { CommunicationListItem } from "@juscash/shared";
import { ReadMoreToggle } from "./read-more-toggle";

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
    readMore: string;
    readLess: string;
  };
}) {
  const recipientNames = item.recipients.map((r) => r.name).join(", ");

  return (
    <article className="comm-card">
      <div className="comm-card-header">
        <div>
          <Link
            href={`/communications/${encodeURIComponent(item.process.number)}`}
            className="comm-card-process"
          >
            {item.process.number}
            {item.process.className ? ` - ${item.process.className}` : ""}
          </Link>
        </div>
        <div className="comm-card-date-right">
          <div className="comm-card-date-label">{messages.date}</div>
          <div>{formatDate(item.publicationDate)}</div>
        </div>
      </div>

      <div className="comm-card-fields">
        <div>
          <div className="comm-card-field-label">{messages.tribunal}</div>
          <div className="comm-card-field-value">{item.process.tribunal.sigla}</div>
        </div>
        <div>
          <div className="comm-card-field-label">{messages.communicationType}</div>
          <div className="comm-card-field-value">{item.type}</div>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <div className="comm-card-field-label">{messages.recipients}</div>
          <div className="comm-card-field-value">{recipientNames || "—"}</div>
        </div>
      </div>

      <div className="comm-card-content-label">{messages.content}</div>
      <ReadMoreToggle
        content={item.content}
        readMoreLabel={messages.readMore}
        readLessLabel={messages.readLess}
      />
    </article>
  );
}
