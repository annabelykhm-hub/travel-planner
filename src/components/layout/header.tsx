import Link from "next/link";
import { Plus } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40" style={{ background: "hsl(210 20% 16%)" }}>
      <div className="container max-w-5xl flex h-14 items-center justify-between">
        <Link href="/" className="text-sm font-medium tracking-wide text-background/70 hover:text-background transition-colors">
          Travel Planner
        </Link>
        <Link
          href="/trips/new"
          className="flex items-center gap-1.5 rounded-full bg-background px-4 py-1.5 text-xs font-medium text-foreground transition-opacity hover:opacity-80"
        >
          <Plus className="h-3 w-3" />
          New trip
        </Link>
      </div>
    </header>
  );
}
