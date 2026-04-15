"use client";

import React, { useState, useCallback, useMemo } from "react";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface DateRangeCalendarProps {
  startDate: string;
  endDate: string;
  onDateSelect: (startDate: string, endDate: string) => void;
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function DateRangeCalendar({
  startDate,
  endDate,
  onDateSelect,
}: DateRangeCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [baseYear, setBaseYear] = useState(() => {
    const d = parseDate(startDate);
    return d ? d.getFullYear() : today.getFullYear();
  });
  const [baseMonth, setBaseMonth] = useState(() => {
    const d = parseDate(startDate);
    return d ? d.getMonth() : today.getMonth();
  });

  const secondMonth = baseMonth === 11 ? 0 : baseMonth + 1;
  const secondYear = baseMonth === 11 ? baseYear + 1 : baseYear;

  const goToPreviousMonth = useCallback(() => {
    if (baseMonth === 0) {
      setBaseYear((y) => y - 1);
      setBaseMonth(11);
    } else {
      setBaseMonth((m) => m - 1);
    }
  }, [baseMonth]);

  const goToNextMonth = useCallback(() => {
    if (baseMonth === 11) {
      setBaseYear((y) => y + 1);
      setBaseMonth(0);
    } else {
      setBaseMonth((m) => m + 1);
    }
  }, [baseMonth]);

  const handleDayClick = useCallback(
    (dateStr: string) => {
      const parsedStart = parseDate(startDate);
      const parsedEnd = parseDate(endDate);
      const clicked = parseDate(dateStr);

      if (!clicked) return;

      if (!parsedStart || (parsedStart && parsedEnd)) {
        onDateSelect(dateStr, "");
      } else if (clicked < parsedStart) {
        onDateSelect(dateStr, "");
      } else {
        onDateSelect(startDate, dateStr);
      }
    },
    [startDate, endDate, onDateSelect],
  );

  const monthName = (month: number, year: number) => {
    const names = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    return `${names[month]} ${year}`;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
      <div className="flex items-center justify-between sm:hidden mb-1">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="flex items-center justify-center w-8 h-8 rounded-md text-neutral-800 hover:bg-neutral-100 transition-colors bg-transparent border-none cursor-pointer"
          aria-label="Mês anterior"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <span className="font-sans font-semibold text-sm text-neutral-800">
          {monthName(baseMonth, baseYear)} — {monthName(secondMonth, secondYear)}
        </span>
        <button
          type="button"
          onClick={goToNextMonth}
          className="flex items-center justify-center w-8 h-8 rounded-md text-neutral-800 hover:bg-neutral-100 transition-colors bg-transparent border-none cursor-pointer"
          aria-label="Próximo mês"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <MonthGrid
        year={baseYear}
        month={baseMonth}
        startDate={startDate}
        endDate={endDate}
        today={today}
        onDayClick={handleDayClick}
        onPrev={goToPreviousMonth}
        showNav="left"
        monthLabel={monthName(baseMonth, baseYear)}
      />
      <MonthGrid
        year={secondYear}
        month={secondMonth}
        startDate={startDate}
        endDate={endDate}
        today={today}
        onDayClick={handleDayClick}
        onNext={goToNextMonth}
        showNav="right"
        monthLabel={monthName(secondMonth, secondYear)}
      />
    </div>
  );
}

function MonthGrid({
  year,
  month,
  startDate,
  endDate,
  today,
  onDayClick,
  onPrev,
  onNext,
  showNav,
  monthLabel,
}: {
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  today: Date;
  onDayClick: (dateStr: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
  showNav: "left" | "right";
  monthLabel: string;
}) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonthDays = new Date(year, month, 0).getDate();
  const nextMonthYear = month === 11 ? year + 1 : year;
  const nextMonthVal = month === 11 ? 0 : month + 1;
  const prevMonthObj = month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 };

  const cells: Array<{ day: number; dateStr: string; isCurrentMonth: boolean }> = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    cells.push({
      day,
      dateStr: toDateString(prevMonthObj.year, prevMonthObj.month, day),
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      day,
      dateStr: toDateString(year, month, day),
      isCurrentMonth: true,
    });
  }

  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day++) {
    cells.push({
      day,
      dateStr: toDateString(nextMonthYear, nextMonthVal, day),
      isCurrentMonth: false,
    });
  }

  const rows: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  const parsedStart = parseDate(startDate);
  const parsedEnd = parseDate(endDate);
  const todayStr = toDateString(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="flex-1 min-w-0">
      <div className="hidden sm:flex items-center justify-between mb-3">
        {showNav === "left" ? (
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center justify-center w-8 h-8 rounded-md text-neutral-800 hover:bg-neutral-100 transition-colors bg-transparent border-none cursor-pointer"
            aria-label="Mês anterior"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        ) : (
          <span />
        )}
        <span className="font-sans font-semibold text-sm text-neutral-800">{monthLabel}</span>
        {showNav === "right" ? (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center justify-center w-8 h-8 rounded-md text-neutral-800 hover:bg-neutral-100 transition-colors bg-transparent border-none cursor-pointer"
            aria-label="Próximo mês"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ) : (
          <span />
        )}
      </div>

      <table className="w-full border-collapse" role="grid">
        <thead>
          <tr>
            {WEEKDAY_LABELS.map((label) => (
              <th
                key={label}
                className="font-sans font-medium text-xs text-neutral-muted pb-2 text-center w-[14.28%]"
                scope="col"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell) => {
                const isStart = cell.dateStr === startDate;
                const isEnd = cell.dateStr === endDate;
                const isToday = cell.dateStr === todayStr;
                const cellDate = parseDate(cell.dateStr);

                let isInRange = false;
                if (parsedStart && parsedEnd && cellDate) {
                  isInRange = cellDate > parsedStart && cellDate < parsedEnd;
                }

                const isSelected = isStart || isEnd;

                let bgClass = "bg-transparent hover:bg-neutral-100";
                let textClass = cell.isCurrentMonth ? "text-neutral-800" : "text-neutral-300";
                let fontClass = "";
                let roundClass = "rounded-md";

                if (isSelected) {
                  bgClass = "bg-[#1b7a4a] hover:bg-[#15633c]";
                  textClass = "text-neutral-50";
                  fontClass = "font-semibold";
                } else if (isInRange) {
                  bgClass = "bg-[#e8f5ee] hover:bg-[#d5eddf]";
                  textClass = "text-neutral-800";
                  roundClass = "rounded-none";
                }

                if (isToday && !isSelected) {
                  fontClass = "font-bold";
                }

                return (
                  <td key={cell.dateStr} className="p-0 text-center">
                    <button
                      type="button"
                      onClick={() => onDayClick(cell.dateStr)}
                      className={`w-full aspect-square flex items-center justify-center font-sans text-[13px] leading-none border-none cursor-pointer transition-colors ${roundClass} ${bgClass} ${textClass} ${fontClass}`}
                      aria-label={cell.dateStr}
                      aria-pressed={isSelected}
                    >
                      {cell.day}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
