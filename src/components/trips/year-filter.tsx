"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function YearFilter({ years, selected }: { years: number[]; selected: number | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function select(year: number | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (year === null) params.delete("year");
    else params.set("year", String(year));
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => select(null)}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          selected === null
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        All
      </button>
      {years.map((y) => (
        <button
          key={y}
          onClick={() => select(y)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            selected === y
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {y}
        </button>
      ))}
    </div>
  );
}
