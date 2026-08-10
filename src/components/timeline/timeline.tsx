"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Trip } from "@/lib/types";
import { conflictingTripIds } from "@/lib/conflicts";
import { TimelineTripBar } from "@/components/timeline/timeline-trip-bar";

const MONTHS = 6;
const ROW_HEIGHT = 36;

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

interface Lane {
  endDate: Date;
}

export function Timeline({ trips }: { trips: Trip[] }) {
  const [offset, setOffset] = useState(0);

  const rangeStart = useMemo(
    () => addMonths(startOfMonth(new Date()), offset),
    [offset]
  );
  const rangeEnd = useMemo(() => addMonths(rangeStart, MONTHS), [rangeStart]);
  const totalDays = daysBetween(rangeStart, rangeEnd);
  const conflicts = useMemo(() => conflictingTripIds(trips), [trips]);

  const visibleTrips = useMemo(
    () =>
      trips
        .filter((t) => t.status !== "cancelled")
        .map((t) => ({
          trip: t,
          start: new Date(t.start_date + "T00:00:00"),
          end: new Date(t.end_date + "T00:00:00"),
        }))
        .filter(({ start, end }) => end >= rangeStart && start <= rangeEnd)
        .sort((a, b) => a.start.getTime() - b.start.getTime()),
    [trips, rangeStart, rangeEnd]
  );

  const lanes: Lane[] = [];
  const placed = visibleTrips.map(({ trip, start, end }) => {
    let lane = lanes.findIndex((l) => l.endDate < start);
    if (lane === -1) {
      lane = lanes.length;
      lanes.push({ endDate: end });
    } else {
      lanes[lane].endDate = end;
    }
    const clampedStart = start < rangeStart ? rangeStart : start;
    const clampedEnd = end > rangeEnd ? rangeEnd : end;
    const left = (daysBetween(rangeStart, clampedStart) / totalDays) * 100;
    const width = Math.max(((daysBetween(clampedStart, clampedEnd) + 1) / totalDays) * 100, 1.5);
    return { trip, left, width, lane };
  });

  const months = Array.from({ length: MONTHS }, (_, i) => addMonths(rangeStart, i));
  const laneCount = Math.max(lanes.length, 1);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOffset((o) => o - 6)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> 6 months
        </button>
        {offset !== 0 && (
          <button
            onClick={() => setOffset(0)}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Today
          </button>
        )}
        <button
          onClick={() => setOffset((o) => o + 6)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          6 months <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card p-4">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-6 border-b pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {months.map((m) => (
              <div key={m.toISOString()}>
                {m.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </div>
            ))}
          </div>
          <div
            className="relative mt-3"
            style={{ height: laneCount * ROW_HEIGHT + 8 }}
          >
            <div className="absolute inset-0 grid grid-cols-6">
              {months.map((m) => (
                <div key={m.toISOString()} className="border-l first:border-l-0" />
              ))}
            </div>
            {placed.map(({ trip, left, width, lane }) => (
              <TimelineTripBar
                key={trip.id}
                trip={trip}
                left={left}
                width={width}
                top={lane * ROW_HEIGHT}
                conflict={conflicts.has(trip.id)}
              />
            ))}
            {placed.length === 0 && (
              <p className="text-sm text-muted-foreground">No trips in this period.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
