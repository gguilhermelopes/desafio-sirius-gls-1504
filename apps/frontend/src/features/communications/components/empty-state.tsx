export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center py-16 px-6">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-neutral-200 mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6d6d6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <h2 className="font-bold text-[13px] leading-[1.2] font-sans text-neutral-800 m-0 mb-2 text-center">{title}</h2>
      <p className="font-normal text-[13px] leading-[1.4] font-sans text-neutral-muted m-0 text-center max-w-[400px]">{description}</p>
    </div>
  );
}
