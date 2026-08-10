import Link from "next/link";
import { Plus } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-md">
      <div className="container flex h-12 items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Travel Planner
        </Link>
        <Link
          href="/trips/new"
          className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-80"
        >
          <Plus className="h-3 w-3" />
          New trip
        </Link>
      </div>
    </header>
  );
}
