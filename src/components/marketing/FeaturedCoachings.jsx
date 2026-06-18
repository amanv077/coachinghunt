import Link from "next/link";
import { CoachingCardGrid } from "@/components/marketing/CoachingCardGrid";
import { Button } from "@/components/ui/Button";

export function FeaturedCoachings({ coachings }) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Top picks
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Featured coachings
            </h2>
            <p className="mt-2 max-w-lg text-muted">
              Verified institutes with high ratings and active demo slots near you.
            </p>
          </div>
          <Link href="/search">
            <Button variant="secondary" size="lg" className="shrink-0">
              Browse all coachings
            </Button>
          </Link>
        </div>

        <CoachingCardGrid coachings={coachings} className="mt-10 sm:grid-cols-2 lg:grid-cols-3" />
      </div>
    </section>
  );
}
