"use client";

import { useState } from "react";
import { Check, Copy, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/trips/status-badge";
import type { Trip } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

export function OverviewTab({ trip }: { trip: Trip }) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/share/${trip.share_token}` : "";

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Destination</p>
            <p className="flex items-center gap-1.5 font-medium">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {trip.destination}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Dates</p>
            <p className="font-medium">{formatDateRange(trip.start_date, trip.end_date)}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Status</p>
            <StatusBadge status={trip.status} />
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Travelers</p>
            <p className="flex items-center gap-1.5 font-medium">
              <Users className="h-4 w-4 text-muted-foreground" />
              {trip.travelers.length > 0 ? trip.travelers.join(", ") : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between gap-3 p-5">
          <div>
            <p className="font-medium">Shareable read-only link</p>
            <p className="truncate text-sm text-muted-foreground">{shareUrl}</p>
          </div>
          <button
            onClick={copyLink}
            className="flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
