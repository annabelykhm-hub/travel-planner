"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Trip } from "@/lib/types";

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function inRange(day: Date, start: Date, end: Date) {
  return day >= start && day <= end;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarView({ trips }: { trips: Trip[] }) {
  const [offset, setOffset] = useState(0);

  const today = useMemo(() => new Date(), []);
  const viewDate = useMemo(
    () => addMonths(new Date(today.getFullYear(), today.getMonth(), 1), offset),
    [offset, today]
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1);
  // Monday-based: 0=Mon … 6=Sun
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const activeTrips = useMemo(
    () =>
      trips
        .filter((t) => t.status !== "cancelled")
        .map((t) => ({
          trip: t,
          start: new Date(t.start_date + "T00:00:00"),
          end: new Date(t.end_date + "T00:00:00"),
        })),
    [trips]
  );

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const date = new Date(year, month, 1 - startOffset + i);
    const isCurrentMonth = date.getMonth() === month;
    const isToday = sameDay(date, today);
    const dayTrips = activeTrips.filter(({ start, end }) => inRange(date, start, end));
    return { date, isCurrentMonth, isToday, dayTrips };
  });

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOffset((o) => o - 1)}
          className="rounded-md p-1 hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">
          {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <button
          onClick={() => setOffset((o) => o + 1)}
          className="rounded-md p-1 hover:bg-muted"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground mb-1">
        {DAYS.map((d) => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {cells.map(({ date, isCurrentMonth, isToday, dayTrips }, i) => (
          <div
            key={i}
            className={`bg-card min-h-[72px] p-1 ${!isCurrentMonth ? "opacity-30" : ""}`}
          >
            <div
              className={`text-xs w-6 h-6 flex items-center justify-center rounded-full mb-0.5 mx-auto
                ${isToday ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground"}`}
            >
              {date.getDate()}
            </div>
            <div className="space-y-0.5">
              {dayTrips.slice(0, 2).map(({ trip }) => (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="block truncate rounded px-1 text-[10px] font-medium text-white leading-4"
                  style={{ backgroundColor: trip.color }}
                  title={trip.destination}
                >
                  {trip.destination}
                </Link>
              ))}
              {dayTrips.length > 2 && (
                <div className="text-[10px] text-muted-foreground px-1">
                  +{dayTrips.length - 2} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
