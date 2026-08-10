"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createTask(tripId: string, title: string, dueDate: string | null) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .insert({ trip_id: tripId, title, due_date: dueDate });
  if (error) throw new Error(error.message);
  revalidatePath(`/trips/${tripId}`);
}

export async function toggleTask(id: string, tripId: string, isDone: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ is_done: isDone }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trips/${tripId}`);
}

export async function deleteTask(id: string, tripId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trips/${tripId}`);
}
