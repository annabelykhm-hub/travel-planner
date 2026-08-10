import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { Trip } from "@/lib/types";
import { findConflicts } from "@/lib/conflicts";
import { formatDateRange } from "@/lib/utils";

export function ConflictBanner({ trips }: { trips: Trip[] }) {
  const conflicts = findConflicts(trips);
  if (conflicts.length === 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="flex-1 space-y-2">
          <p className="font-medium text-amber-900">
            {conflicts.length} scheduling conflict{conflicts.length > 1 ? "s" : ""} detected
          </p>
          <ul className="space-y-1 text-sm text-amber-800">
            {conflicts.map((c, i) => (
              <li key={i}>
                <Link href={`/trips/${c.a.id}`} className="font-medium underline hover:no-underline">
                  {c.a.title}
                </Link>{" "}
                overlaps with{" "}
                <Link href={`/trips/${c.b.id}`} className="font-medium underline hover:no-underline">
                  {c.b.title}
                </Link>{" "}
                ({formatDateRange(c.overlapStart, c.overlapEnd)})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
