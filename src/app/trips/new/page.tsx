import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TripForm } from "@/components/trips/trip-form";
import type { Trip } from "@/lib/types";

export default async function NewTripPage() {
  const supabase = await createClient();
  const { data: trips } = await supabase.from("trips").select("country, color");

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>New trip</CardTitle>
        </CardHeader>
        <CardContent>
          <TripForm existingTrips={(trips ?? []) as Pick<Trip, "country" | "color">[]} />
        </CardContent>
      </Card>
    </div>
  );
}
