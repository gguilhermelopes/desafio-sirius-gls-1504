"use client";

import React from "react";
import { useState } from "react";
import clsx from "clsx";
import { FormattedCommunicationContent } from "./formatted-communication-content";
import { normalizeCommunicationContent } from "../lib/content-format";

export function ReadMoreToggle({
  content,
  readMoreLabel,
  readLessLabel,
}: {
  content: string;
  readMoreLabel: string;
  readLessLabel: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const normalizedContent = normalizeCommunicationContent(content);

  return (
    <div>
      <p
        className={clsx(
          "font-sans font-normal text-[16px] leading-[1.5] text-neutral-800",
          !expanded && "line-clamp-3"
        )}
      >
        <FormattedCommunicationContent content={content} />
      </p>
      {normalizedContent.length > 300 && (
        <button
          className="font-sans font-normal text-[13px] leading-[1.2] text-neutral-800 bg-transparent border-none p-0 cursor-pointer mt-2 hover:underline"
          onClick={() => setExpanded((prev) => !prev)}
          type="button"
        >
          {expanded ? readLessLabel : readMoreLabel}
        </button>
      )}
    </div>
  );
}
