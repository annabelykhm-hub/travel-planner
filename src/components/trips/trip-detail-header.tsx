"use client";

import { useTransition } from "react";
import Link from "next/link";
import { MoreVertical, Pencil, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/trips/status-badge";
import type { Trip } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";
import { deleteTrip } from "@/lib/actions/trips";

export function TripDetailHeader({ trip }: { trip: Trip }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${trip.title}"? This can't be undone.`)) return;
    startTransition(() => deleteTrip(trip.id));
  }

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: trip.color }} />
          <h1 className="text-2xl font-semibold tracking-tight">{trip.title}</h1>
          <StatusBadge status={trip.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {trip.destination} · {formatDateRange(trip.start_date, trip.end_date)}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/trips/${trip.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/share/${trip.share_token}`} target="_blank">
              <Share2 className="mr-2 h-4 w-4" /> View share page
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem destructive onClick={handleDelete} disabled={isPending}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
