import React from "react";
import { FormattedCommunicationContent } from "./formatted-communication-content";

export function HighlightTransitado({ text }: { text: string }) {
  return <FormattedCommunicationContent content={text} highlightTransitado />;
}
