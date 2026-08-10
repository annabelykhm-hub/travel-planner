"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { TripStatus } from "@/lib/types";

export interface TripFormInput {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: TripStatus;
  travelers: string[];
  color: string;
  purpose: string;
  notes: string;
}

export async function createTrip(input: TripFormInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("trips").insert(input).select("id").single();
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect(`/trips/${data.id}`);
}

export async function updateTrip(id: string, input: TripFormInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("trips").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath(`/trips/${id}`);
  redirect(`/trips/${id}`);
}

export async function deleteTrip(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("trips").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/");
}

export async function updateTripNotes(id: string, notes: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("trips").update({ notes }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trips/${id}`);
}
