export type TripStatus = "planning" | "confirmed" | "in_progress" | "completed" | "cancelled";

export type BookingType = "flight" | "hotel" | "car" | "train" | "activity" | "other";

export interface Trip {
  id: string;
  title: string;
  destination: string;
  country: string | null;
  city: string | null;
  start_date: string;
  end_date: string;
  status: TripStatus;
  travelers: string[];
  color: string;
  purpose: string | null;
  notes: string | null;
  share_token: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  trip_id: string;
  type: BookingType;
  title: string;
  provider: string | null;
  confirmation_number: string | null;
  start_at: string | null;
  end_at: string | null;
  location: string | null;
  cost: number | null;
  notes: string | null;
  created_at: string;
}

export interface TripDocument {
  id: string;
  trip_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_at: string;
}

export interface TripTask {
  id: string;
  trip_id: string;
  title: string;
  is_done: boolean;
  due_date: string | null;
  created_at: string;
}

export const TRIP_STATUSES: { value: TripStatus; label: string }[] = [
  { value: "planning", label: "Planning" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const BOOKING_TYPES: { value: BookingType; label: string }[] = [
  { value: "flight", label: "Flight" },
  { value: "hotel", label: "Hotel" },
  { value: "car", label: "Car" },
  { value: "train", label: "Train" },
  { value: "activity", label: "Activity" },
  { value: "other", label: "Other" },
];

export const TRIP_COLORS = [
  "#6366f1",
  "#f59e0b",
  "#22c55e",
  "#0ea5e9",
  "#ec4899",
  "#a855f7",
  "#14b8a6",
  "#ef4444",
];
