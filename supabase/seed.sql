-- Sample data for the travel planner. Safe to re-run (clears existing rows first).
-- Dates are anchored around 2026-06-30 so they show up on the 6-month timeline.

truncate table tasks, documents, bookings, trips restart identity cascade;

insert into trips (id, title, destination, start_date, end_date, status, travelers, color, notes) values
  ('00000000-0000-0000-0000-000000000001', 'Lisbon Offsite', 'Lisbon, Portugal', '2026-07-06', '2026-07-11', 'confirmed', '{"Anna","James"}', '#6366f1', 'Annual team offsite. Hotel block booked under company account.'),
  ('00000000-0000-0000-0000-000000000002', 'Tokyo Client Visit', 'Tokyo, Japan', '2026-07-09', '2026-07-14', 'planning', '{"Anna"}', '#f59e0b', 'Overlaps with Lisbon trip — needs resolving.'),
  ('00000000-0000-0000-0000-000000000003', 'Family Reunion', 'Lake Como, Italy', '2026-08-02', '2026-08-09', 'confirmed', '{"Anna","Maria","Tom","Sophie"}', '#22c55e', 'Villa booked. Bring the good camera.'),
  ('00000000-0000-0000-0000-000000000004', 'NYC Board Meeting', 'New York, USA', '2026-09-14', '2026-09-17', 'confirmed', '{"Anna"}', '#0ea5e9', 'Quarterly board meeting + investor dinner on the 16th.'),
  ('00000000-0000-0000-0000-000000000005', 'Berlin Conference', 'Berlin, Germany', '2026-10-05', '2026-10-09', 'planning', '{"Anna","James"}', '#ec4899', 'Speaking slot pending confirmation.'),
  ('00000000-0000-0000-0000-000000000006', 'Cape Town Retreat', 'Cape Town, South Africa', '2026-11-16', '2026-11-23', 'planning', '{"Anna"}', '#a855f7', 'Tentative — waiting on visa requirements.'),
  ('00000000-0000-0000-0000-000000000007', 'Ski Trip', 'Aspen, USA', '2026-12-18', '2026-12-27', 'confirmed', '{"Anna","Maria"}', '#14b8a6', 'Cabin rental confirmed. Need to rent gear.');

insert into bookings (trip_id, type, title, provider, confirmation_number, start_at, end_at, location, cost, notes) values
  ('00000000-0000-0000-0000-000000000001', 'flight', 'Outbound flight to Lisbon', 'TAP Air Portugal', 'TAP-8K2J9', '2026-07-06 09:20:00+00', '2026-07-06 13:05:00+00', 'JFK → LIS', 612.00, 'Seat 14C, window'),
  ('00000000-0000-0000-0000-000000000001', 'hotel', 'Hotel Avenida Palace', 'Avenida Palace', 'AP-554211', '2026-07-06 15:00:00+00', '2026-07-11 11:00:00+00', 'Lisbon, Portugal', 980.00, '5 nights, company rate'),
  ('00000000-0000-0000-0000-000000000002', 'flight', 'Lisbon → Tokyo', 'ANA', 'ANA-7731F', '2026-07-09 22:40:00+00', '2026-07-10 19:15:00+00', 'LIS → HND', 1450.00, 'Connects through Frankfurt'),
  ('00000000-0000-0000-0000-000000000003', 'car', 'Rental car', 'Hertz', 'HZ-220984', '2026-08-02 10:00:00+00', '2026-08-09 10:00:00+00', 'Milan Malpensa', 410.00, 'Full-size, automatic'),
  ('00000000-0000-0000-0000-000000000004', 'hotel', 'The Langham', 'Langham Hotels', 'LH-99021', '2026-09-14 15:00:00+00', '2026-09-17 11:00:00+00', 'New York, USA', 1320.00, 'Board rate applied');

insert into tasks (trip_id, title, is_done, due_date) values
  ('00000000-0000-0000-0000-000000000001', 'Confirm offsite agenda with James', true, '2026-06-25'),
  ('00000000-0000-0000-0000-000000000001', 'Book airport transfer', false, '2026-07-01'),
  ('00000000-0000-0000-0000-000000000002', 'Resolve date conflict with Lisbon trip', false, '2026-07-02'),
  ('00000000-0000-0000-0000-000000000002', 'Apply for Japan visa', false, '2026-07-01'),
  ('00000000-0000-0000-0000-000000000003', 'Pack camera + extra batteries', false, '2026-07-28'),
  ('00000000-0000-0000-0000-000000000004', 'Prepare board deck', false, '2026-09-10'),
  ('00000000-0000-0000-0000-000000000007', 'Rent ski gear', false, '2026-12-10');
