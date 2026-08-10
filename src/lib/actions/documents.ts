"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function uploadDocument(tripId: string, formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("No file provided");
  if (file.type !== "application/pdf") throw new Error("Only PDF files are supported");

  const supabase = await createClient();
  const path = `${tripId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("trip-documents")
    .upload(path, file, { contentType: file.type });
  if (uploadError) throw new Error(uploadError.message);

  const { error: insertError } = await supabase.from("documents").insert({
    trip_id: tripId,
    file_name: file.name,
    file_path: path,
    file_size: file.size,
    mime_type: file.type,
  });
  if (insertError) throw new Error(insertError.message);

  revalidatePath(`/trips/${tripId}`);
}

export async function getDocumentUrl(filePath: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("trip-documents")
    .createSignedUrl(filePath, 60 * 10);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function deleteDocument(id: string, filePath: string, tripId: string) {
  const supabase = await createClient();
  await supabase.storage.from("trip-documents").remove([filePath]);
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trips/${tripId}`);
}
