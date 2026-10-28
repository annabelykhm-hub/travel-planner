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
  country: string;
  city: string;
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

export async function duplicateTrip(id: string) {
  const supabase = await createClient();
  const { data: trip, error: fetchError } = await supabase.from("trips").select("*").eq("id", id).single();
  if (fetchError || !trip) throw new Error(fetchError?.message ?? "Not found");
  const { id: _id, created_at: _ca, share_token: _st, ...rest } = trip;
  const { data, error } = await supabase
    .from("trips")
    .insert({ ...rest, title: `${trip.title} (copy)`, start_date: "", end_date: "", status: "planning" })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect(`/trips/${data.id}/edit`);
}

export async function updateTripNotes(id: string, notes: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("trips").update({ notes }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trips/${id}`);
}
