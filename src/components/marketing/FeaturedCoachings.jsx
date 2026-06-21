"use client";

import Link from "next/link";
import { CoachingCardGrid } from "@/components/marketing/CoachingCardGrid";
import { Button } from "@/components/ui/Button";

export function FeaturedCoachings({ coachings }) {
  return (
    <section className="py-16 sm:py-24 bg-surface-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header Block */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-secondary">
              Top Picks
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Featured coaching institutes
            </h2>
            <p className="mt-2.5 max-w-lg text-sm text-muted">
              Verified top-rated academies offering free interactive demo lectures this week.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Visual swipe hint only shown on mobile */}
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary/70 md:hidden animate-pulse">
              Swipe to explore
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <Link href="/search" className="shrink-0">
              <Button variant="secondary" size="md" className="w-full md:w-auto font-semibold">
                Browse All Coachings
              </Button>
            </Link>
          </div>
        </div>

        {/* Coachings Grid/Carousel */}
        <div className="mt-8 sm:mt-10">
          <CoachingCardGrid
            coachings={coachings}
            mobileCarousel={true}
            className="sm:grid-cols-2 lg:grid-cols-3"
          />
        </div>
      </div>
    </section>
  );
}
