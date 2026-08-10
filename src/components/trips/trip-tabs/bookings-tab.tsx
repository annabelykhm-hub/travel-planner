"use client";

import { useState, useTransition } from "react";
import { Plane, Hotel, Car, Train, Ticket, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BOOKING_TYPES, type Booking, type BookingType } from "@/lib/types";
import { createBooking, deleteBooking } from "@/lib/actions/bookings";

const ICONS: Record<BookingType, typeof Plane> = {
  flight: Plane,
  hotel: Hotel,
  car: Car,
  train: Train,
  activity: Ticket,
  other: MoreHorizontal,
};

export function BookingsTab({ tripId, bookings }: { tripId: string; bookings: Booking[] }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<BookingType>("flight");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const startAt = formData.get("start_at") as string;
    const endAt = formData.get("end_at") as string;
    const cost = formData.get("cost") as string;
    startTransition(async () => {
      await createBooking({
        trip_id: tripId,
        type,
        title: String(formData.get("title")),
        provider: String(formData.get("provider") ?? ""),
        confirmation_number: String(formData.get("confirmation_number") ?? ""),
        start_at: startAt ? new Date(startAt).toISOString() : null,
        end_at: endAt ? new Date(endAt).toISOString() : null,
        location: String(formData.get("location") ?? ""),
        cost: cost ? Number(cost) : null,
        notes: String(formData.get("notes") ?? ""),
      });
      setOpen(false);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" /> Add booking
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add booking</DialogTitle>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as BookingType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOKING_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Outbound flight" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="provider">Provider</Label>
                  <Input id="provider" name="provider" placeholder="TAP Air Portugal" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmation_number">Confirmation #</Label>
                  <Input id="confirmation_number" name="confirmation_number" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="start_at">Start</Label>
                  <Input id="start_at" name="start_at" type="datetime-local" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="end_at">End</Label>
                  <Input id="end_at" name="end_at" type="datetime-local" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="JFK → LIS" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cost">Cost (USD)</Label>
                  <Input id="cost" name="cost" type="number" step="0.01" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" rows={2} />
              </div>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Saving…" : "Add booking"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {bookings.length === 0 ? (
        <p className="text-sm text-muted-foreground">No bookings yet.</p>
      ) : (
        <div className="space-y-2">
          {bookings.map((b) => {
            const Icon = ICONS[b.type];
            return (
              <Card key={b.id}>
                <CardContent className="flex items-start gap-3 p-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{b.title}</p>
                      {b.cost != null && (
                        <span className="text-sm text-muted-foreground">${b.cost.toFixed(2)}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {[b.provider, b.location].filter(Boolean).join(" · ") || "—"}
                    </p>
                    {b.confirmation_number && (
                      <p className="text-xs text-muted-foreground">Conf# {b.confirmation_number}</p>
                    )}
                  </div>
                  <button
                    onClick={() => startTransition(() => deleteBooking(b.id, tripId))}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Delete booking"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
