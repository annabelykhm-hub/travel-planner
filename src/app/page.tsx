import { createClient } from "@/lib/supabase/server";
import type { Trip } from "@/lib/types";
import { ViewSwitcher } from "@/components/trips/view-switcher";
import { ConflictBanner } from "@/components/trips/conflict-banner";
import { TripCard } from "@/components/trips/trip-card";
import { YearFilter } from "@/components/trips/year-filter";
import { conflictingTripIds } from "@/lib/conflicts";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const { year } = await searchParams;
  const selectedYear = year ? parseInt(year) : null;

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  await supabase
    .from("trips")
    .update({ status: "completed" })
    .in("status", ["planning", "confirmed"])
    .lt("end_date", today);

  const { data: trips, error } = await supabase
    .from("trips")
    .select("*")
    .order("start_date", { ascending: true });

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Couldn&apos;t load trips: {error.message}. Make sure your Supabase env vars are set and the
        schema has been applied (see README.md).
      </div>
    );
  }

  const allTrips = (trips ?? []) as Trip[];

  const years = [...new Set(allTrips.map((t) => new Date(t.start_date).getFullYear()))].sort(
    (a, b) => b - a
  );

  const filtered = selectedYear
    ? allTrips.filter((t) => new Date(t.start_date).getFullYear() === selectedYear)
    : allTrips;

  const conflicts = conflictingTripIds(allTrips);

  const active = filtered.filter((t) => t.status !== "cancelled");
  const current = active.filter((t) => t.start_date <= today && t.end_date >= today);
  const upcoming = active.filter((t) => t.start_date > today);
  const past = active.filter((t) => t.end_date < today).reverse();
  const cancelled = filtered.filter((t) => t.status === "cancelled");

  function TripSection({ title, items }: { title: string; items: Trip[] }) {
    if (items.length === 0) return null;
    return (
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((trip) => (
            <TripCard key={trip.id} trip={trip} conflict={conflicts.has(trip.id)} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trips</h1>
          <p className="text-sm text-muted-foreground">Everything coming up, at a glance.</p>
        </div>
      </div>

      {years.length > 1 && <YearFilter years={years} selected={selectedYear} />}

      <ConflictBanner trips={allTrips} />

      <ViewSwitcher trips={filtered} />

      <TripSection title="Now" items={current} />
      <TripSection title="Upcoming" items={upcoming} />
      <TripSection title="Past" items={past} />
      <TripSection title="Cancelled" items={cancelled} />

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">No trips for this year.</p>
      )}
    </div>
  );
}
