import React from "react";

type AuthSubmitButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  loadingContent?: React.ReactNode;
};

export function AuthSubmitButton({
  children,
  disabled = false,
  loading = false,
  loadingContent,
}: AuthSubmitButtonProps) {
  return (
    <button
      aria-busy={loading}
      className="relative w-full min-h-9 border-0 rounded-md bg-blue-600 text-neutral-50 font-sans cursor-pointer text-[13px] leading-[1.2] hover:bg-blue-700 disabled:cursor-wait disabled:opacity-100"
      disabled={disabled}
      type="submit"
    >
      {loading ? loadingContent : children}
    </button>
  );
}
