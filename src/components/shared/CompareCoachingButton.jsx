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

export function CompareCoachingButton({ coaching, className }) {
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare();
  const selected = isInCompare(coaching.id);
  const full = compareList.length >= 3 && !selected;

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (selected) {
      removeFromCompare(coaching.id);
    } else if (!full) {
      addToCompare(coaching);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={full}
      className={cn(
        "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition shadow-sm",
        selected
          ? "bg-secondary text-white ring-2 ring-secondary/30"
          : "border-2 border-secondary bg-secondary-light text-secondary hover:bg-secondary hover:text-white",
        full && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <CompareGlyph className="h-4 w-4 shrink-0" />
      {selected ? "Added to compare" : full ? "Compare full (3/3)" : "Add to compare"}
    </button>
  );
}
