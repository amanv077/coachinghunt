"use client";

import { useState } from "react";
import Link from "next/link";
import { useCompare } from "@/components/shared/CompareContext";
import { CoachingCard } from "@/components/marketing/CoachingCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils/cn";

export function SavedCoachingsClient({ coachings = [] }) {
  const { compareList, addToCompare, removeFromCompare, isInCompare, clearCompare } = useCompare();
  const [selectMode, setSelectMode] = useState(false);

  const selectedCount = coachings.filter((c) => isInCompare(c.id)).length;

  const compareHref =
    compareList.length >= 2
      ? `/compare?ids=${compareList.map((item) => item.id).join(",")}`
      : null;

  function toggleSelect(coaching) {
    if (isInCompare(coaching.id)) {
      removeFromCompare(coaching.id);
    } else if (compareList.length < 3) {
      addToCompare(coaching);
    }
  }

  if (coachings.length === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          title="No saved coachings yet"
          description="Tap the heart on any coaching card while browsing to save it here."
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/search" className="w-full sm:w-auto">
            <Button className="min-h-11 w-full sm:w-auto">Find coachings</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {selectMode ? `Selected for compare: ${selectedCount}/3` : `${coachings.length} saved`}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {selectMode
              ? "Pick 2–3 institutes, then compare fees, batches, and demos."
              : "Shortlist institutes you like, then compare or book a demo."}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant={selectMode ? "secondary" : "primary"}
            className="min-h-11 w-full sm:w-auto"
            onClick={() => {
              if (selectMode) {
                setSelectMode(false);
              } else {
                setSelectMode(true);
              }
            }}
          >
            {selectMode ? "Done selecting" : "Select to compare"}
          </Button>
          {selectMode && compareList.length > 0 && (
            <Button type="button" variant="ghost" className="min-h-11 w-full sm:w-auto" onClick={clearCompare}>
              Clear selection
            </Button>
          )}
          {compareHref && (
            <Link href={compareHref} className="w-full sm:w-auto">
              <Button className="min-h-11 w-full sm:w-auto">Compare selected</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coachings.map((coaching) => {
          const selected = isInCompare(coaching.id);
          const full = compareList.length >= 3 && !selected;

          return (
            <div key={coaching.id} className="relative">
              {selectMode && (
                <button
                  type="button"
                  disabled={full}
                  onClick={() => toggleSelect(coaching)}
                  className={cn(
                    "absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white shadow-md transition",
                    selected
                      ? "border-secondary bg-secondary text-white"
                      : "border-border text-muted",
                    full && "cursor-not-allowed opacity-50"
                  )}
                  aria-label={selected ? `Remove ${coaching.name} from compare` : `Add ${coaching.name} to compare`}
                >
                  {selected ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="h-3 w-3 rounded-full border-2 border-current" />
                  )}
                </button>
              )}
              <CoachingCard coaching={coaching} isSaved showActions />
            </div>
          );
        })}
      </div>
    </div>
  );
}
