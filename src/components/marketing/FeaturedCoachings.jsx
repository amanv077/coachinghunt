"use client";

import Link from "next/link";
import { CoachingCardGrid } from "@/components/marketing/CoachingCardGrid";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export function FeaturedCoachings({ coachings }) {
  const list = coachings || [];
  const hasDemos = list.some((c) => (c.openDemoCount ?? c._count?.demoSlots ?? 0) > 0);

  return (
    <section className="bg-surface-muted/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-secondary">
              Top Picks
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Featured coaching institutes
            </h2>
            <p className="mt-2.5 max-w-lg text-sm text-muted">
              {hasDemos
                ? "Verified top-rated academies with open demo slots you can book today."
                : "Verified top-rated academies students are exploring right now."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {list.length > 0 && (
              <span className="inline-flex animate-pulse items-center gap-1.5 text-xs font-medium text-secondary/70 md:hidden">
                Swipe to explore
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            )}
            <Link href="/search" className="shrink-0">
              <Button variant="secondary" size="md" className="w-full font-semibold md:w-auto">
                Browse All Coachings
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 sm:mt-10">
          {list.length === 0 ? (
            <div className="space-y-4">
              <EmptyState
                title="Featured institutes coming soon"
                description="We're onboarding verified coachings every week. Browse all listings or search by exam and city."
              />
              <div className="flex justify-center">
                <Link href="/search">
                  <Button className="min-h-11">Find coachings</Button>
                </Link>
              </div>
            </div>
          ) : (
            <CoachingCardGrid
              coachings={list}
              mobileCarousel={true}
              className="sm:grid-cols-2 lg:grid-cols-3"
            />
          )}
        </div>
      </div>
    </section>
  );
}
