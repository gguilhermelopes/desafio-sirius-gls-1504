"use client";

import React from "react";
import clsx from "clsx";

type CustomSelectOption = {
  description?: string;
  label: string;
  value: string;
};

export function CustomSelect({
  ariaLabel,
  onChange,
  options,
  placeholder,
  value,
}: {
  ariaLabel: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder: string;
  value: string;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (!open) return;

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className="flex min-h-9 w-full items-center justify-between gap-2 rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-left font-sans text-[13px] leading-[1.2] text-neutral-800"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          aria-hidden="true"
          className="text-neutral-muted flex-none"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m7 15 5 5 5-5" />
          <path d="m7 9 5-5 5 5" />
        </svg>
      </button>

      {open ? (
        <div
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 grid max-h-[280px] w-full gap-1 overflow-y-auto rounded-md border border-neutral-300 bg-neutral-50 p-2 shadow-dropdown sm:right-auto sm:w-[260px]"
          role="listbox"
        >
          <button
            aria-selected={!value}
            className={clsx(
              "grid gap-[2px] w-full px-3 py-[10px] border-0 rounded-md bg-transparent text-neutral-800 cursor-pointer font-sans font-medium text-[13px] leading-[1.2] text-left",
              !value && "bg-neutral-100"
            )}
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            role="option"
            type="button"
          >
            {placeholder}
          </button>

          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                aria-selected={isSelected}
                className={clsx(
                  "grid gap-[2px] w-full px-3 py-[10px] border-0 rounded-md text-neutral-800 cursor-pointer font-sans font-medium text-[13px] leading-[1.2] text-left hover:bg-neutral-100",
                  isSelected ? "bg-neutral-100" : "bg-transparent"
                )}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                role="option"
                type="button"
              >
                <span>{option.label}</span>
                {option.description ? (
                  <span className="text-neutral-muted font-sans font-normal text-[12px] leading-[1.3]">
                    {option.description}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
