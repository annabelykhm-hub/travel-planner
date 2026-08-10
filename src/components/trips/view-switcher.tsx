"use client";

import { useState } from "react";
import type { Trip } from "@/lib/types";
import { Timeline } from "@/components/timeline/timeline";
import { CalendarView } from "@/components/calendar/calendar-view";

export function ViewSwitcher({ trips }: { trips: Trip[] }) {
  const [view, setView] = useState<"timeline" | "calendar">("timeline");

  return (
    <div className="space-y-4">
      <div className="flex gap-4 border-b border-border">
        {(["timeline", "calendar"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`pb-2 text-sm capitalize transition-colors ${
              view === v
                ? "border-b-2 border-foreground font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === "timeline" ? <Timeline trips={trips} /> : <CalendarView trips={trips} />}
    </div>
  );
}
