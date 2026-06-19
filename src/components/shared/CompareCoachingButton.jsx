"use client";

import { useCompare } from "@/components/shared/CompareContext";
import { cn } from "@/lib/utils/cn";

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
        "min-h-9 rounded-full border px-3 text-xs font-medium transition",
        selected
          ? "border-secondary bg-secondary-light text-secondary"
          : "border-border bg-white text-muted hover:border-secondary hover:text-secondary",
        full && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {selected ? "Added" : "Compare"}
    </button>
  );
}
