"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCompare } from "@/components/shared/CompareContext";
import { Button } from "@/components/ui/Button";

export function CompareEmptyState() {
  const { compareList } = useCompare();
  const router = useRouter();

  useEffect(() => {
    if (compareList.length >= 2) {
      const ids = compareList.map((item) => item.id).join(",");
      router.replace(`/compare?ids=${ids}`);
    }
  }, [compareList, router]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
      <h1 className="text-2xl font-bold">Compare coachings</h1>
      <p className="mt-3 text-muted">
        {compareList.length === 1
          ? "Add one more coaching to compare side-by-side."
          : "Shortlist 2–3 coachings from search or your Saved list, then compare fees, batches, and demos."}
      </p>
      {compareList.length > 0 && (
        <p className="mt-2 text-sm font-medium text-secondary">
          Currently selected: {compareList.map((c) => c.name).join(", ")} ({compareList.length}/3)
        </p>
      )}
      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <Link href="/search">
          <Button className="min-h-11 w-full sm:w-auto">Find coachings</Button>
        </Link>
        <Link href="/student/saved">
          <Button variant="secondary" className="min-h-11 w-full sm:w-auto">
            Open saved
          </Button>
        </Link>
      </div>
    </div>
  );
}
