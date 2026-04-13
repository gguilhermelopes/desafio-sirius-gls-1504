import React from "react";

type AuthInlineErrorProps = {
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
};

export function AuthInlineError({
  children,
  className,
  iconClassName,
}: AuthInlineErrorProps) {
  return (
    <div className={className} role="alert">
      {iconClassName ? <span className={iconClassName} aria-hidden="true" /> : null}
      <span>{children}</span>
    </div>
  );
}
