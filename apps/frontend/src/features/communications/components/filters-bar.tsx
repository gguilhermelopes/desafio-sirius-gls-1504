"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { TribunalItem } from "@juscash/shared";
import { apiFetch } from "@/lib/api/fetcher";

export function FiltersBar({ messages }: { messages: { searchPlaceholder: string; tribunalPlaceholder: string; dateRangePlaceholder: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [tribunals, setTribunals] = useState<TribunalItem[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    apiFetch<{ items: TribunalItem[] }>("/tribunals")
      .then((data) => setTribunals(data.items))
      .catch(() => {});
  }, []);

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

  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams("search", value || null);
    }, 300);
  }

  function handleTribunalChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateParams("tribunalId", e.target.value || null);
  }

  function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateParams("startDate", e.target.value || null);
  }

  function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateParams("endDate", e.target.value || null);
  }

  return (
    <div className="comm-filters-card">
      <div className="comm-filter-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder={messages.searchPlaceholder}
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      <select
        className="comm-filter-select"
        defaultValue={searchParams.get("tribunalId") ?? ""}
        onChange={handleTribunalChange}
      >
        <option value="">{messages.tribunalPlaceholder}</option>
        {tribunals.map((t) => (
          <option key={t.id} value={t.id}>
            {t.sigla}
          </option>
        ))}
      </select>
      <div className="comm-filter-date">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
        </svg>
        <input
          type="date"
          defaultValue={searchParams.get("startDate") ?? ""}
          onChange={handleStartDateChange}
        />
        <span>-</span>
        <input
          type="date"
          defaultValue={searchParams.get("endDate") ?? ""}
          onChange={handleEndDateChange}
        />
      </div>
    </div>
  );
}
