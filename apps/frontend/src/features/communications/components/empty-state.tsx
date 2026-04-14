export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="comm-empty">
      <div className="comm-empty-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6d6d6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <h2 className="comm-empty-title">{title}</h2>
      <p className="comm-empty-description">{description}</p>
    </div>
  );
}
