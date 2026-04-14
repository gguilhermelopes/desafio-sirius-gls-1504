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
      className={`skeleton${className ? ` ${className}` : ""}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
