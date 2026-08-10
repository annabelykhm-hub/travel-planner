import type { Trip } from "@/lib/types";

export interface TripConflict {
  a: Trip;
  b: Trip;
  overlapStart: string;
  overlapEnd: string;
}

function overlaps(a: Trip, b: Trip) {
  return a.start_date < b.end_date && b.start_date < a.end_date;
}

/** Pairwise overlap detection across active (non-cancelled) trips. */
export function findConflicts(trips: Trip[]): TripConflict[] {
  const active = trips.filter((t) => t.status !== "cancelled");
  const conflicts: TripConflict[] = [];
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const a = active[i];
      const b = active[j];
      if (overlaps(a, b)) {
        conflicts.push({
          a,
          b,
          overlapStart: a.start_date > b.start_date ? a.start_date : b.start_date,
          overlapEnd: a.end_date < b.end_date ? a.end_date : b.end_date,
        });
      }
    }
  }
  return conflicts;
}

export function conflictingTripIds(trips: Trip[]): Set<string> {
  const ids = new Set<string>();
  for (const c of findConflicts(trips)) {
    ids.add(c.a.id);
    ids.add(c.b.id);
  }
  return ids;
}
