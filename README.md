# Travel Planner

A travel planning app for a personal assistant: trips database, 6-month
timeline, overlap/conflict detection, per-trip bookings/documents/tasks/notes,
and a shareable read-only trip page.

Stack: Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Supabase
(Postgres + Storage).

## 1. Prerequisites

This project was authored without a local Node.js runtime available, so it
has **not been run or built yet**. You'll need:

- Node.js 18.18+ (20 LTS recommended) and npm
- A Supabase project (free tier is enough) — https://supabase.com

## 2. Install dependencies

```bash
cd travel-planner
npm install
```

## 3. Set up Supabase

1. Create a new Supabase project.
2. In the Supabase SQL editor, run [`supabase/schema.sql`](supabase/schema.sql).
   This creates the `trips`, `bookings`, `documents`, `tasks` tables, the
   `trip-documents` storage bucket, and permissive RLS policies (this app has
   no auth layer — it's meant to be run by a single trusted assistant/user,
   ideally behind your own access control such as a VPN or hosting platform
   password).
3. Optionally seed sample data by running [`supabase/seed.sql`](supabase/seed.sql).
4. Copy `.env.local.example` to `.env.local` and fill in your project's URL
   and anon key (Project Settings → API):

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Run it

```bash
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/
    page.tsx                 dashboard: timeline + trip list + conflicts
    trips/new/page.tsx       create trip form
    trips/[id]/page.tsx      trip detail (tabs: Overview/Bookings/Documents/Tasks/Notes)
    trips/[id]/edit/page.tsx edit trip form
    share/[token]/page.tsx   read-only shareable trip page
  components/
    ui/                      shadcn/ui primitives
    timeline/                horizontal 6-month timeline
    trips/                   trip cards, forms, tabs, conflict banner
    layout/                  header
  lib/
    actions/                 server actions (trips, bookings, documents, tasks)
    supabase/                browser + server Supabase clients
    types.ts                 shared TypeScript types
    conflicts.ts             overlap/conflict detection
supabase/
  schema.sql                 database schema + storage bucket + RLS
  seed.sql                   sample trips/bookings/tasks for local testing
```

## Notes on the conflict detection

`src/lib/conflicts.ts` does a pairwise date-range overlap check across all
non-cancelled trips. It powers both the dashboard's conflict banner and the
amber highlight/border on overlapping bars in the timeline.

## Notes on document uploads

PDFs are uploaded directly to a private `trip-documents` Supabase Storage
bucket via a server action (`src/lib/actions/documents.ts`), which also
writes a row to the `documents` table. Viewing a document generates a
short-lived signed URL rather than exposing the bucket publicly.

## What's not done

- No authentication — see the RLS note above before deploying this publicly.
- Not run/built locally (no Node.js in the authoring environment) — run
  `npm install && npm run dev` and fix any version-drift issues from the
  pinned dependency versions in `package.json` if you hit them.
