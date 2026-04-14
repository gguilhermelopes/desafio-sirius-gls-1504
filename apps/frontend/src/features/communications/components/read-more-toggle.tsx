"use client";

import { useState } from "react";

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

  return (
    <div>
      <p className={`comm-card-content${expanded ? "" : " is-truncated"}`}>
        {content}
      </p>
      {content.length > 300 && (
        <button
          className="comm-card-read-more"
          onClick={() => setExpanded((prev) => !prev)}
          type="button"
        >
          {expanded ? readLessLabel : readMoreLabel}
        </button>
      )}
    </div>
  );
}
