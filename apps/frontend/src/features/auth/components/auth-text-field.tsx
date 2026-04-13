import React from "react";

type AuthTextFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  error?: string;
  errorClassName?: string;
  fieldClassName?: string;
  helper?: string;
  helperClassName?: string;
  helperErrorClassName?: string;
  helperVisibleClassName?: string;
  inputClassName?: string;
  label: string;
  labelClassName?: string;
  reserveHelperSpace?: boolean;
  shellClassName?: string;
  shellInvalidClassName?: string;
  showHelperWithError?: boolean;
  trailingAdornment?: React.ReactNode;
};

export function AuthTextField({
  error,
  errorClassName,
  fieldClassName,
  helper,
  helperClassName,
  helperErrorClassName,
  helperVisibleClassName,
  inputClassName,
  label,
  labelClassName,
  reserveHelperSpace = false,
  shellClassName,
  shellInvalidClassName,
  showHelperWithError = false,
  trailingAdornment,
  ...inputProps
}: AuthTextFieldProps) {
  const helperText = helper ?? (reserveHelperSpace ? "\u00A0" : null);
  const helperClasses = [
    helperClassName,
    helperText ? helperVisibleClassName : null,
  ]
    .filter(Boolean)
    .join(" ");
  const errorClasses =
    errorClassName ??
    [helperClassName, helperVisibleClassName, helperErrorClassName]
      .filter(Boolean)
      .join(" ");
  const shellClasses = [shellClassName, error ? shellInvalidClassName : null]
    .filter(Boolean)
    .join(" ");
  const inputElement = (
    <input
      aria-invalid={Boolean(error)}
      className={inputClassName}
      {...inputProps}
    />
  );

  return (
    <label className={fieldClassName}>
      <span className={labelClassName}>{label}</span>
      {shellClasses || trailingAdornment ? (
        <div className={shellClasses}>
          {inputElement}
          {trailingAdornment}
        </div>
      ) : (
        inputElement
      )}
      {helperText && (!error || showHelperWithError) ? (
        <small className={helperClasses}>{helperText}</small>
      ) : null}
      {error ? <small className={errorClasses}>{error}</small> : null}
    </label>
  );
}
