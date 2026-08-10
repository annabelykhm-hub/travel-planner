import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Booking, Trip, TripDocument, TripTask } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TripDetailHeader } from "@/components/trips/trip-detail-header";
import { OverviewTab } from "@/components/trips/trip-tabs/overview-tab";
import { BookingsTab } from "@/components/trips/trip-tabs/bookings-tab";
import { DocumentsTab } from "@/components/trips/trip-tabs/documents-tab";
import { TasksTab } from "@/components/trips/trip-tabs/tasks-tab";
import { NotesTab } from "@/components/trips/trip-tabs/notes-tab";

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: trip }, { data: bookings }, { data: documents }, { data: tasks }] = await Promise.all([
    supabase.from("trips").select("*").eq("id", id).single(),
    supabase.from("bookings").select("*").eq("trip_id", id).order("start_at", { ascending: true }),
    supabase.from("documents").select("*").eq("trip_id", id).order("uploaded_at", { ascending: false }),
    supabase.from("tasks").select("*").eq("trip_id", id).order("created_at", { ascending: true }),
  ]);

  if (!trip) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <TripDetailHeader trip={trip as Trip} />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab trip={trip as Trip} />
        </TabsContent>
        <TabsContent value="bookings">
          <BookingsTab tripId={id} bookings={(bookings ?? []) as Booking[]} />
        </TabsContent>
        <TabsContent value="documents">
          <DocumentsTab tripId={id} documents={(documents ?? []) as TripDocument[]} />
        </TabsContent>
        <TabsContent value="tasks">
          <TasksTab tripId={id} tasks={(tasks ?? []) as TripTask[]} />
        </TabsContent>
        <TabsContent value="notes">
          <NotesTab tripId={id} notes={(trip as Trip).notes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
