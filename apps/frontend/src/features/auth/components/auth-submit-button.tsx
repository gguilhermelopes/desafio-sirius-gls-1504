import React from "react";

type AuthSubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingContent?: React.ReactNode;
};

export function AuthSubmitButton({
  children,
  className,
  disabled = false,
  loading = false,
  loadingContent,
}: AuthSubmitButtonProps) {
  return (
    <button className={className} disabled={disabled} type="submit">
      {loading ? loadingContent : children}
    </button>
  );
}
