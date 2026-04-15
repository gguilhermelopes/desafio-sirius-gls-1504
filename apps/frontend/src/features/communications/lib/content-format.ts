export type CommunicationContentToken =
  | { type: "break" }
  | { type: "link"; href: string; label: string }
  | { type: "text"; value: string };

export function normalizeCommunicationContent(content: string): string {
  return getCommunicationContentTokens(content)
    .map((token) => {
      if (token.type === "break") return "\n";
      if (token.type === "link") return `${token.label} (${token.href})`;
      return token.value;
    })
    .join("")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function getCommunicationContentTokens(
  content: string,
): CommunicationContentToken[] {
  const normalized = content.replace(/<br\s*\/?>/gi, "\n");
  const anchorRegex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  const tokens: CommunicationContentToken[] = [];
  let cursor = 0;

  for (const match of normalized.matchAll(anchorRegex)) {
    const matchIndex = match.index ?? 0;
    const [fullMatch, href, label] = match;

    pushTextTokens(tokens, normalized.slice(cursor, matchIndex));

    tokens.push({
      type: "link",
      href: decodeEntities(href.trim()),
      label: stripTags(label).trim() || decodeEntities(href.trim()),
    });

    cursor = matchIndex + fullMatch.length;
  }

  pushTextTokens(tokens, normalized.slice(cursor));
  return tokens;
}

function pushTextTokens(tokens: CommunicationContentToken[], raw: string) {
  const cleaned = stripTags(raw);
  const parts = decodeEntities(cleaned).split("\n");

  parts.forEach((part, index) => {
    if (part) {
      tokens.push({ type: "text", value: part });
    }
    if (index < parts.length - 1) {
      tokens.push({ type: "break" });
    }
  });
}

function stripTags(value: string): string {
  return value
    .replace(/[a-zA-Z0-9#.\-_\s,]+\{[^}]*\}/g, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\s{2,}/g, " ");
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}
