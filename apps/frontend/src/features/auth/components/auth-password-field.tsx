"use client";

import React from "react";
import { useState } from "react";
import { AuthTextField } from "./auth-text-field";

type AuthPasswordFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className" | "type"
> & {
  error?: string;
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
  toggleButtonClassName?: string;
  toggleHideLabel?: string;
  toggleIconClassName?: string;
  toggleShowLabel?: string;
};

export function AuthPasswordField({
  error,
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
  toggleButtonClassName,
  toggleHideLabel = "Ocultar senha",
  toggleIconClassName,
  toggleShowLabel = "Mostrar senha",
  ...inputProps
}: AuthPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthTextField
      {...inputProps}
      error={error}
      fieldClassName={fieldClassName}
      helper={helper}
      helperClassName={helperClassName}
      helperErrorClassName={helperErrorClassName}
      helperVisibleClassName={helperVisibleClassName}
      inputClassName={inputClassName}
      label={label}
      labelClassName={labelClassName}
      reserveHelperSpace={reserveHelperSpace}
      shellClassName={shellClassName}
      shellInvalidClassName={shellInvalidClassName}
      trailingAdornment={
        <button
          aria-label={showPassword ? toggleHideLabel : toggleShowLabel}
          className={toggleButtonClassName}
          onClick={(event) => {
            event.preventDefault();
            setShowPassword((current) => !current);
          }}
          type="button"
        >
          <svg
            aria-hidden="true"
            className={toggleIconClassName}
            fill="none"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.167 8C2.207 5.893 4.853 4 8 4s5.793 1.893 6.833 4c-1.04 2.107-3.686 4-6.833 4S2.207 10.107 1.167 8Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.33"
            />
            <circle
              cx="8"
              cy="8"
              r="1.667"
              stroke="currentColor"
              strokeWidth="1.33"
            />
            {showPassword ? (
              <path
                d="M3 13L13 3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.33"
              />
            ) : null}
          </svg>
        </button>
      }
      type={showPassword ? "text" : "password"}
    />
  );
}
