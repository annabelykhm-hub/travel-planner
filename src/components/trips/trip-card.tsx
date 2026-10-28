import Link from "next/link";
import type { Trip } from "@/lib/types";
import { formatDateRange, tripDays } from "@/lib/utils";

export function TripCard({ trip, conflict }: { trip: Trip; conflict?: boolean }) {
  const city = trip.city || trip.country || trip.destination;
  const country = trip.city ? (trip.country || trip.destination) : null;
  const isNow = trip.status === "in_progress";

  return (
    <Link href={`/trips/${trip.id}`}>
      <div
        className={`group relative overflow-hidden rounded-2xl bg-card transition-all hover:-translate-y-1 h-full ${
          conflict ? "ring-2 ring-amber-300" : ""
        }`}
        style={{ background: `${trip.color}12`, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        <div className="h-1 w-full" style={{ backgroundColor: trip.color }} />

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-2xl font-medium tracking-tight leading-tight text-foreground truncate">
                {city}
              </h3>
              {country && (
                <p className="text-sm text-muted-foreground mt-0.5">{country}</p>
              )}
            </div>
            {isNow && (
              <span className="shrink-0 mt-0.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-foreground text-background">
                Now
              </span>
            )}
            {trip.status === "planning" && (
              <span className="shrink-0 mt-0.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-amber-100 text-amber-700">
                Planning
              </span>
            )}
            {trip.status === "confirmed" && (
              <span className="shrink-0 mt-0.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-emerald-100 text-emerald-700">
                Confirmed
              </span>
            )}
          </div>

          {trip.purpose && (
            <p className="mt-3 text-xs text-muted-foreground">{trip.purpose}</p>
          )}

          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {formatDateRange(trip.start_date, trip.end_date)}
            </p>
            <p className="text-xs text-muted-foreground/60 shrink-0">
              {tripDays(trip.start_date, trip.end_date)}
            </p>
          </div>

          {trip.travelers.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground/60">{trip.travelers.join(", ")}</p>
          )}

          {(trip.country === "United Kingdom" || trip.country === "UK") && (
            <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
              🇬🇧 UK visa
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
