"use client";

import { useCompare } from "@/components/shared/CompareContext";
import { cn } from "@/lib/utils/cn";

function CompareGlyph({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M8 3H5a2 2 0 00-2 2v14a2 2 0 002 2h3M16 3h3a2 2 0 012 2v14a2 2 0 01-2 2h-3M12 7v10" />
    </svg>
  );
}

export function CompareCoachingButton({ coaching, className, size = "default" }) {
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare();
  const selected = isInCompare(coaching.id);
  const full = compareList.length >= 3 && !selected;
  const compact = size === "sm";

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (selected) {
      removeFromCompare(coaching.id);
    } else if (!full) {
      addToCompare(coaching);
    }
  }

  const label = selected
    ? compact
      ? "Added"
      : "Added to compare"
    : full
      ? compact
        ? "Full"
        : "Compare full (3/3)"
      : compact
        ? "Compare"
        : "Add to compare";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={full}
      aria-label={compact ? (selected ? "Remove from compare" : "Add to compare") : undefined}
      className={cn(
        compact
          ? "inline-flex min-h-11 shrink-0 items-center justify-center gap-1 rounded-xl border px-2.5 text-xs font-medium transition"
          : "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition shadow-sm",
        selected
          ? compact
            ? "border-secondary bg-secondary-light text-secondary"
            : "bg-secondary text-white ring-2 ring-secondary/30"
          : compact
            ? "border-border bg-white text-muted hover:border-secondary hover:bg-secondary-light hover:text-secondary"
            : "border-2 border-secondary bg-secondary-light text-secondary hover:bg-secondary hover:text-white",
        full && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <CompareGlyph className={cn("shrink-0", compact ? "h-3.5 w-3.5" : "h-4 w-4")} />
      {label}
    </button>
  );
}
