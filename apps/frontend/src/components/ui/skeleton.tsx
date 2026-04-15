export function Skeleton({
  width,
  height,
  className,
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
}) {
  return (
    <div
      className={`bg-neutral-200 rounded-md animate-[skeleton-pulse_1.5s_ease-in-out_infinite]${className ? ` ${className}` : ""}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
