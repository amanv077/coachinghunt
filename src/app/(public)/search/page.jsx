import { Suspense } from "react";
import { listPublicCoachings } from "@/modules/coachings/coachings.service";
import { CoachingCard } from "@/components/marketing/CoachingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchFilters } from "@/components/marketing/SearchFilters";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "Search Coachings",
  description: "Search and filter offline coaching institutes by city, exam, and subject.",
};

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const result = await listPublicCoachings({
    q: params.q,
    city: params.city,
    targetExam: params.targetExam,
    subject: params.subject,
    page: Number(params.page || 1),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Find Coachings</h1>
      <p className="text-muted">{result.total} institutes found</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-4">
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <SearchFilters />
        </Suspense>
        <div className="lg:col-span-3">
          {result.items.length === 0 ? (
            <EmptyState
              title="No coachings found"
              description="Try adjusting your filters or search terms."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {result.items.map((coaching) => (
                <CoachingCard key={coaching.id} coaching={coaching} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
