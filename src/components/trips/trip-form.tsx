"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TRIP_STATUSES, TRIP_COLORS, type Trip } from "@/lib/types";
import { createTrip, updateTrip, type TripFormInput } from "@/lib/actions/trips";
import { cn } from "@/lib/utils";

export function TripForm({ trip }: { trip?: Trip }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState(trip?.color ?? TRIP_COLORS[0]);
  const [status, setStatus] = useState(trip?.status ?? "planning");
  const [travelers, setTravelers] = useState(trip?.travelers.join(", ") ?? "");

  function handleSubmit(formData: FormData) {
    setError(null);
    const input: TripFormInput = {
      title: String(formData.get("title")),
      destination: String(formData.get("destination")),
      start_date: String(formData.get("start_date")),
      end_date: String(formData.get("end_date")),
      status: status as TripFormInput["status"],
      travelers: travelers.split(",").map((t) => t.trim()).filter(Boolean),
      color,
      purpose: String(formData.get("purpose") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    startTransition(async () => {
      try {
        if (trip) {
          await updateTrip(trip.id, input);
        } else {
          await createTrip(input);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={trip?.title} placeholder="Lisbon Offsite" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          name="destination"
          defaultValue={trip?.destination}
          placeholder="Lisbon, Portugal"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="purpose">Purpose</Label>
        <Input id="purpose" name="purpose" defaultValue={trip?.purpose ?? ""} placeholder="Work trip, vacation, conference…" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="start_date">Start date</Label>
          <Input id="start_date" name="start_date" type="date" defaultValue={trip?.start_date} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end_date">End date</Label>
          <Input id="end_date" name="end_date" type="date" defaultValue={trip?.end_date} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRIP_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="travelers">Travelers</Label>
          <Input
            id="travelers"
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
            placeholder="Anna, James"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Color</Label>
        <div className="flex gap-2">
          {TRIP_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "h-7 w-7 rounded-full border-2 transition-transform",
                color === c ? "scale-110 border-foreground" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
              aria-label={`Choose color ${c}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={trip?.notes ?? ""} rows={4} />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving…" : trip ? "Save changes" : "Create trip"}
      </Button>
    </form>
  );
}
