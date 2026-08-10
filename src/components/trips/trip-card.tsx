import Link from "next/link";
import type { Trip } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

export function TripCard({ trip, conflict }: { trip: Trip; conflict?: boolean }) {
  return (
    <Link href={`/trips/${trip.id}`}>
      <div
        className={`group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-sm hover:-translate-y-px ${
          conflict ? "border-amber-300" : "border-border"
        }`}
      >
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: trip.color }}
        />
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold tracking-tight">
                {trip.city ? `${trip.city}, ${trip.country || trip.destination}` : (trip.country || trip.destination)}
              </h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusStyle(trip.status)}`}>
              {trip.status === "in_progress" ? "Now" : trip.status}
            </span>
          </div>
          {trip.purpose && (
            <p className="mt-1 text-xs font-medium text-foreground/70">{trip.purpose}</p>
          )}
          <p className="mt-1.5 text-xs text-muted-foreground">{formatDateRange(trip.start_date, trip.end_date)}</p>
          {trip.travelers.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">{trip.travelers.join(", ")}</p>
          )}
        </div>
      </div>
    </Link>
  );
}


function statusStyle(status: string) {
  switch (status) {
    case "planning": return "bg-amber-50 text-amber-700";
    case "confirmed": return "bg-emerald-50 text-emerald-700";
    case "in_progress": return "bg-blue-50 text-blue-700";
    case "completed": return "bg-muted text-muted-foreground";
    case "cancelled": return "bg-red-50 text-red-600";
    default: return "bg-muted text-muted-foreground";
  }
}
