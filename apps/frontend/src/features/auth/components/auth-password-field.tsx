"use client";

import React from "react";
import { useState } from "react";
import { AuthTextField } from "./auth-text-field";

type AuthPasswordFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className" | "type"
> & {
  error?: string;
  helper?: string;
  label: string;
  reserveHelperSpace?: boolean;
  showHelperWithError?: boolean;
  toggleHideLabel?: string;
  toggleShowLabel?: string;
};

export function AuthPasswordField({
  error,
  helper,
  label,
  reserveHelperSpace = false,
  showHelperWithError = false,
  toggleHideLabel = "Ocultar senha",
  toggleShowLabel = "Mostrar senha",
  ...inputProps
}: AuthPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthTextField
      {...inputProps}
      error={error}
      helper={helper}
      label={label}
      reserveHelperSpace={reserveHelperSpace}
      showHelperWithError={showHelperWithError}
      trailingAdornment={
        <button
          aria-label={showPassword ? toggleHideLabel : toggleShowLabel}
          className="inline-flex items-center justify-center w-5 h-5 p-0 border-0 bg-transparent text-neutral-800 cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            setShowPassword((current) => !current);
          }}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4 block"
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
