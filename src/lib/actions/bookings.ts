"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { BookingType } from "@/lib/types";

export interface BookingFormInput {
  trip_id: string;
  type: BookingType;
  title: string;
  provider: string;
  confirmation_number: string;
  start_at: string | null;
  end_at: string | null;
  location: string;
  cost: number | null;
  notes: string;
}

export async function createBooking(input: BookingFormInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("bookings").insert(input);
  if (error) throw new Error(error.message);
  revalidatePath(`/trips/${input.trip_id}`);
}

export async function deleteBooking(id: string, tripId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trips/${tripId}`);
}
