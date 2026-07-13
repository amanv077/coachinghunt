"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CoachingLogo } from "@/components/shared/CoachingMedia";

export function SimilarCoachingsStrip({ coachings, city }) {
  if (!coachings?.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">
        Explore similar coachings{city ? ` in ${city}` : ""}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {coachings.map((coaching) => (
          <Link key={coaching.id} href={`/coaching/${coaching.slug}`}>
            <Card className="flex items-center gap-3 p-4 hover:border-secondary/40 transition">
              <CoachingLogo src={coaching.logoUrl} name={coaching.name} size="sm" />
              <div className="min-w-0">
                <p className="truncate font-medium">{coaching.name}</p>
                <p className="text-sm text-muted">
                  {coaching.city}
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
