"use client";

import Link from "next/link";
import { useCompare } from "@/components/shared/CompareContext";
import { Button } from "@/components/ui/Button";

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  const ids = compareList.map((item) => item.id).join(",");
  const ready = compareList.length >= 2;

  return (
    <div className="fixed inset-x-0 bottom-20 z-[70] border-t border-border bg-white/95 p-3 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur md:bottom-4 md:mx-auto md:max-w-2xl md:rounded-2xl md:border">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-foreground">
            {compareList.length}/3 selected
          </span>
          {compareList.map((item) => (
            <span
              key={item.id}
              className="inline-flex max-w-[140px] items-center gap-1 rounded-full bg-secondary-light px-2.5 py-1 text-xs font-medium text-secondary"
            >
              <span className="truncate">{item.name}</span>
              <button
                type="button"
                onClick={() => removeFromCompare(item.id)}
                className="ml-0.5 flex min-h-6 min-w-6 items-center justify-center rounded-full text-secondary hover:bg-white hover:text-foreground"
                aria-label={`Remove ${item.name} from compare`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" className="min-h-11" onClick={clearCompare}>
            Clear
          </Button>
          {ready ? (
            <Link href={`/compare?ids=${ids}`} className="flex-1 sm:flex-none">
              <Button size="sm" className="min-h-11 w-full sm:min-w-[130px]">
                Compare now
              </Button>
            </Link>
          ) : (
            <Button size="sm" className="min-h-11 flex-1 sm:min-w-[130px]" disabled>
              Add one more
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
