"use client";

import Link from "next/link";
import { CoachingLogo } from "@/components/shared/CoachingMedia";
import { Card } from "@/components/ui/Card";

export function RecentlyViewedStrip({ items, title = "Continue exploring" }) {
  if (!items?.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {items.map((coaching) => (
          <Link
            key={coaching.id}
            href={`/coaching/${coaching.slug}`}
            className="min-w-[200px] shrink-0"
          >
            <Card className="flex items-center gap-3 p-3 hover:border-secondary/40 transition">
              <CoachingLogo src={coaching.logoUrl} name={coaching.name} size="sm" />
              <div className="min-w-0">
                <p className="truncate font-medium text-sm">{coaching.name}</p>
                <p className="truncate text-xs text-muted">
                  {coaching.city || "—"}
                  {coaching.avgRating ? ` · ★ ${coaching.avgRating.toFixed(1)}` : ""}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
