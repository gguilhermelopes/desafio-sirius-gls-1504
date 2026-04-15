import React from "react";
import { getCommunicationContentTokens } from "../lib/content-format";

export function FormattedCommunicationContent({
  content,
  highlightTransitado = false,
}: {
  content: string;
  highlightTransitado?: boolean;
}) {
  const tokens = getCommunicationContentTokens(content);

  return (
    <>
      {tokens.map((token, index) => {
        if (token.type === "break") {
          return <br key={`break-${index}`} />;
        }

        if (token.type === "link") {
          return (
            <a
              key={`link-${index}`}
              className="text-neutral-muted font-bold no-underline hover:text-neutral-800 hover:underline"
              href={token.href}
              rel="noreferrer"
              target="_blank"
            >
              {token.label}
            </a>
          );
        }

        return (
          <React.Fragment key={`text-${index}`}>
            {highlightTransitado
              ? highlightOccurrences(token.value)
              : token.value}
          </React.Fragment>
        );
      })}
    </>
  );
}

function highlightOccurrences(text: string) {
  const regex = /transitou em julgado/gi;
  const parts = text.split(regex);
  const matches = text.match(regex);

  if (!matches || parts.length === 1) {
    return text;
  }

  return parts.map((part, index) => (
    <React.Fragment key={index}>
      {part}
      {index < parts.length - 1 ? (
        <strong className="font-bold text-red-700">{matches[index]}</strong>
      ) : null}
    </React.Fragment>
  ));
}
