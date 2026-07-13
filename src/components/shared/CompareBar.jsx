"use client";

import Link from "next/link";
import { useCompare } from "@/components/shared/CompareContext";
import { Button } from "@/components/ui/Button";

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  const ids = compareList.map((item) => item.id).join(",");

  return (
    <div className="fixed bottom-20 inset-x-0 z-[70] border-t-2 border-secondary/20 bg-white p-4 shadow-[0_-8px_30px_rgba(44,76,156,0.15)] md:bottom-4 md:mx-auto md:max-w-3xl md:rounded-2xl md:border md:border-secondary/20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Compare {compareList.length}/3
          </span>
          {compareList.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1 rounded-full bg-secondary-light px-3 py-1.5 text-xs font-medium text-secondary"
            >
              {item.name}
              <button
                type="button"
                onClick={() => removeFromCompare(item.id)}
                className="ml-1 min-h-6 min-w-6 rounded-full text-secondary hover:bg-white hover:text-foreground"
                aria-label={`Remove ${item.name} from compare`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm" className="min-h-11" onClick={clearCompare}>
            Clear
          </Button>
          <Link href={`/compare?ids=${ids}`} className="flex-1 sm:flex-none">
            <Button size="sm" className="min-h-11 w-full shadow-md sm:min-w-[140px]">
              Compare now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
