import { notFound } from "next/navigation";
import { MapPin, Plane, Hotel, Car, Train, Ticket, MoreHorizontal, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Booking, BookingType, Trip, TripTask } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/trips/status-badge";
import { formatDateRange } from "@/lib/utils";

const ICONS: Record<BookingType, typeof Plane> = {
  flight: Plane,
  hotel: Hotel,
  car: Car,
  train: Train,
  activity: Ticket,
  other: MoreHorizontal,
};

export default async function SharedTripPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("share_token", token)
    .single();

  if (!trip) notFound();

  const [{ data: bookings }, { data: tasks }] = await Promise.all([
    supabase.from("bookings").select("*").eq("trip_id", trip.id).order("start_at", { ascending: true }),
    supabase.from("tasks").select("*").eq("trip_id", trip.id).order("created_at", { ascending: true }),
  ]);

  const tripData = trip as Trip;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
        Read-only shared view
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tripData.color }} />
          <h1 className="text-2xl font-semibold tracking-tight">{tripData.title}</h1>
          <StatusBadge status={tripData.status} />
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" /> {tripData.destination}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatDateRange(tripData.start_date, tripData.end_date)}
        </p>
        {tripData.travelers.length > 0 && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" /> {tripData.travelers.join(", ")}
          </p>
        )}
      </div>

      {tripData.notes && (
        <Card>
          <CardContent className="p-5 text-sm whitespace-pre-wrap">{tripData.notes}</CardContent>
        </Card>
      )}

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Bookings</h2>
        {(bookings ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings shared.</p>
        ) : (
          <div className="space-y-2">
            {(bookings as Booking[]).map((b) => {
              const Icon = ICONS[b.type];
              return (
                <Card key={b.id}>
                  <CardContent className="flex items-start gap-3 p-4">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium">{b.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {[b.provider, b.location].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Tasks</h2>
        {(tasks ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks shared.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {(tasks as TripTask[]).map((t) => (
              <li key={t.id} className={t.is_done ? "text-muted-foreground line-through" : ""}>
                {t.title}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
