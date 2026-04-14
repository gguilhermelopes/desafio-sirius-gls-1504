export function HighlightTransitado({ text }: { text: string }) {
  const regex = /transitou em julgado/gi;
  const parts = text.split(regex);
  const matches = text.match(regex);

  if (!matches || parts.length === 1) {
    return <>{text}</>;
  }

  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <strong className="highlight-transitado">{matches[i]}</strong>
          )}
        </span>
      ))}
    </>
  );
}
