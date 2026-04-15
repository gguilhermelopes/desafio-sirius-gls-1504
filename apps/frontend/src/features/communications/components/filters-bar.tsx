"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TribunalItem } from "@juscash/shared";
import { apiFetch } from "@/lib/api/fetcher";
import { CustomSelect } from "@/components/ui/custom-select";
import { DateRangeCalendar } from "./date-range-calendar";

export function FiltersBar({ messages }: { messages: { searchPlaceholder: string; tribunalPlaceholder: string; dateRangePlaceholder: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [tribunals, setTribunals] = useState<TribunalItem[]>([]);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const dateMenuRef = useRef<HTMLDivElement>(null);

  const tribunalId = searchParams.get("tribunalId") ?? "";
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";
  const hasDateFilter = Boolean(startDate || endDate);

  const dateRangeLabel = useMemo(() => {
    if (!startDate && !endDate) {
      return messages.dateRangePlaceholder;
    }

    return `${formatDateLabel(startDate)} - ${formatDateLabel(endDate)}`;
  }, [endDate, messages.dateRangePlaceholder, startDate]);

  useEffect(() => {
    apiFetch<{ items: TribunalItem[] }>("/tribunals")
      .then((data) => setTribunals(data.items))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!dateMenuRef.current?.contains(event.target as Node)) {
        setIsDateMenuOpen(false);
      }
    }

    if (!isDateMenuOpen) {
      return;
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isDateMenuOpen]);

  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/communications?${params.toString()}`);
    },
    [router, searchParams],
  );

  const updateMultipleParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.delete("page");
      router.push(`/communications?${params.toString()}`);
    },
    [router, searchParams],
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams("search", value || null);
    }, 300);
  }

  function handleTribunalChange(value: string) {
    updateParams("tribunalId", value || null);
  }

  function handleDateSelect(newStartDate: string, newEndDate: string) {
    updateMultipleParams({
      startDate: newStartDate || null,
      endDate: newEndDate || null,
    });
  }

  return (
    <div className="mb-4 grid grid-cols-1 items-center gap-3 rounded-md border border-neutral-300 bg-neutral-50 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_177px_191px]">
      <div className="flex min-w-0 items-center gap-2 rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 font-sans text-[13px] leading-[1.2] text-neutral-800">
        <svg className="text-neutral-muted shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          className="flex-1 border-none bg-transparent font-sans text-[13px] leading-[1.2] text-neutral-800 outline-none placeholder:text-neutral-muted"
          type="text"
          placeholder={messages.searchPlaceholder}
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      <div>
        <CustomSelect
          ariaLabel="Selecionar tribunal"
          onChange={handleTribunalChange}
          options={tribunals.map((tribunal) => ({
            description: tribunal.name,
            label: tribunal.sigla,
            value: String(tribunal.id),
          }))}
          placeholder={messages.tribunalPlaceholder}
          value={tribunalId}
        />
      </div>

      <div className="relative" ref={dateMenuRef}>
        <button
          aria-expanded={isDateMenuOpen}
          aria-haspopup="dialog"
          className={`flex w-full min-w-0 items-center gap-2 rounded-md border px-3 py-2 text-left font-sans text-[13px] leading-[1.2] cursor-pointer transition-all ${
            hasDateFilter
              ? "border-neutral-800 bg-neutral-50 text-neutral-800"
              : "border-neutral-300 bg-neutral-50 text-neutral-muted hover:border-neutral-800"
          }`}
          onClick={() => setIsDateMenuOpen((current) => !current)}
          type="button"
        >
          <svg className={hasDateFilter ? "text-[#1b7a4a] shrink-0" : "shrink-0"} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
          </svg>
          <span className="truncate">{dateRangeLabel}</span>
          {hasDateFilter ? (
            <span
              role="button"
              tabIndex={0}
              aria-label="Limpar filtro de data"
              className="ml-auto shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-neutral-muted hover:bg-neutral-200 hover:text-neutral-800 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleDateSelect("", "");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDateSelect("", "");
                }
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </span>
          ) : null}
        </button>

        {isDateMenuOpen ? (
          <div
            className="absolute right-0 top-[calc(100%+8px)] z-20 rounded-lg border border-neutral-300 bg-neutral-50 p-5 shadow-dropdown w-[min(calc(100vw-32px),580px)]"
            role="dialog"
          >
            <DateRangeCalendar
              startDate={startDate}
              endDate={endDate}
              onDateSelect={handleDateSelect}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function formatDateLabel(value: string) {
  if (!value) {
    return "dd/mm/aaaa";
  }

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}
