"use client";

import Link from "next/link";
import type { Trip } from "@/lib/types";

export function TimelineTripBar({
  trip,
  left,
  width,
  top,
  conflict,
}: {
  trip: Trip;
  left: number;
  width: number;
  top: number;
  conflict: boolean;
}) {
  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group absolute flex h-7 items-center overflow-hidden rounded-md px-2 text-xs font-medium text-white shadow-sm transition-transform hover:z-10 hover:scale-[1.02]"
      style={{
        left: `${left}%`,
        width: `${width}%`,
        top,
        backgroundColor: trip.color,
        border: conflict ? "2px solid #f59e0b" : undefined,
      }}
      title={`${trip.destination} — ${trip.title}`}
    >
      <span className="truncate">{trip.destination}</span>
    </Link>
  );
}
