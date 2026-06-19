"use client";

import Link from "next/link";
import { useCompare } from "@/components/shared/CompareContext";
import { Button } from "@/components/ui/Button";

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  const ids = compareList.map((item) => item.id).join(",");

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-white p-4 shadow-lg md:bottom-4 md:mx-auto md:max-w-3xl md:rounded-2xl md:border">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            Compare ({compareList.length}/3)
          </span>
          {compareList.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1 rounded-full bg-secondary-light px-3 py-1 text-xs font-medium text-secondary"
            >
              {item.name}
              <button
                type="button"
                onClick={() => removeFromCompare(item.id)}
                className="ml-1 text-secondary hover:text-foreground"
                aria-label={`Remove ${item.name} from compare`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm" className="min-h-10" onClick={clearCompare}>
            Clear
          </Button>
          <Link href={`/compare?ids=${ids}`}>
            <Button size="sm" className="min-h-10 w-full sm:w-auto">
              Compare now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
