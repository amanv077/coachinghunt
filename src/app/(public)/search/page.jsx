import { Suspense } from "react";
import { listPublicCoachings } from "@/modules/coachings/coachings.service";
import { getSavedCoachingIds } from "@/modules/saved-coachings/saved-coachings.service";
import { getSession } from "@/lib/auth/session";
import { CoachingCardGrid } from "@/components/marketing/CoachingCardGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  SearchFilters,
  ActiveFilterChips,
  SearchResultHeader,
  SearchToolbar,
  SearchPagination,
} from "@/components/marketing/SearchFilters";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Search Coachings",
  description: "Search and filter offline coaching institutes by city, exam, and subject.",
};

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params.page || 1);
  const session = await getSession();
  const [result, savedIds] = await Promise.all([
    listPublicCoachings({
      q: params.q,
      city: params.city,
      targetExam: params.targetExam,
      subject: params.subject,
      maxFee: params.maxFee ? Number(params.maxFee) : undefined,
      page,
      sort: params.sort || "newest",
    }),
    session?.user?.role === "STUDENT"
      ? getSavedCoachingIds(session.user.id)
      : Promise.resolve([]),
  ]);

  const hasFilters = !!(params.q || params.city || params.targetExam || params.subject || params.maxFee);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Find Coachings</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted sm:text-base">
          Browse verified institutes, compare courses, and book free demo sessions near you.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="mt-6 h-24 w-full rounded-2xl" />}>
        <SearchToolbar />
      </Suspense>

      <div className="mt-4">
        <SearchResultHeader total={result.total} params={params} />
      </div>

      <div className="mt-4 space-y-3 lg:hidden">
        <Suspense fallback={<Skeleton className="h-11 w-full" />}>
          <SearchFilters mobileOnly />
        </Suspense>
        <Suspense fallback={null}>
          <ActiveFilterChips />
        </Suspense>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-4">
        <Suspense fallback={<Skeleton className="hidden h-64 w-full lg:block" />}>
          <SearchFilters />
        </Suspense>
        <div className="lg:col-span-3">
          <div className="mb-4 hidden lg:block">
            <Suspense fallback={null}>
              <ActiveFilterChips />
            </Suspense>
          </div>
          {result.items.length === 0 ? (
            <div className="space-y-4">
              <EmptyState
                title="No coachings found"
                description={
                  hasFilters
                    ? "Try a different city, remove a filter, or search by exam name."
                    : "Start by searching your city or pick a popular exam above."
                }
              />
              <div className="flex justify-center">
                {hasFilters ? (
                  <Link href="/search">
                    <Button variant="secondary" className="min-h-11">
                      Clear all filters
                    </Button>
                  </Link>
                ) : (
                  <Link href="/search?targetExam=JEE">
                    <Button variant="secondary" className="min-h-11">
                      Browse JEE coachings
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <>
              <CoachingCardGrid
                coachings={result.items}
                savedIds={savedIds}
                showActions={session?.user?.role === "STUDENT"}
              />
              <Suspense fallback={null}>
                <SearchPagination page={result.page} totalPages={result.totalPages} />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
