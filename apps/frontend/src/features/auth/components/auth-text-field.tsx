import clsx from "clsx";
import React, { useId } from "react";

type AuthTextFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  error?: string;
  helper?: string;
  label: string;
  reserveHelperSpace?: boolean;
  showHelperWithError?: boolean;
  trailingAdornment?: React.ReactNode;
};

export function AuthTextField({
  error,
  helper,
  label,
  reserveHelperSpace = false,
  showHelperWithError = false,
  trailingAdornment,
  ...inputProps
}: AuthTextFieldProps) {
  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  const helperText = helper ?? (reserveHelperSpace ? "\u00A0" : null);

  const describedBy = [
    error ? errorId : null,
    helperText && (!error || showHelperWithError) ? helperId : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const inputElement = (
    <input
      aria-describedby={describedBy}
      aria-invalid={Boolean(error)}
      className="w-full min-w-0 border-0 p-0 bg-transparent text-neutral-800 font-[inherit] placeholder:text-neutral-muted focus:outline-none"
      {...inputProps}
    />
  );

  return (
    <label className="grid gap-2">
      <span className="text-neutral-800 text-base leading-[1.2]">{label}</span>
      <div
        className={clsx(
          "flex items-center gap-2 h-9 px-3 border rounded-md bg-neutral-50",
          error ? "border-red-600" : "border-neutral-300"
        )}
      >
        {inputElement}
        {trailingAdornment}
      </div>
      {helperText && (!error || showHelperWithError) ? (
        <small
          className={clsx(
            "m-0 min-h-4",
            helperText ? "text-neutral-muted" : "text-transparent"
          )}
          id={helperId}
        >
          {helperText}
        </small>
      ) : null}
      {error ? (
        <small
          className="m-0 min-h-4 text-red-600"
          id={errorId}
          role="alert"
        >
          {error}
        </small>
      ) : null}
    </label>
  );
}
