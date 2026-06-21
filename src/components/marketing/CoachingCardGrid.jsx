"use client";

import { useState } from "react";
import { CoachingCard } from "@/components/marketing/CoachingCard";
import { CoachingPreviewSheet } from "@/components/marketing/CoachingPreviewSheet";
import { cn } from "@/lib/utils/cn";

export function CoachingCardGrid({ coachings, className, savedIds = [], showActions = false, mobileCarousel = false }) {
  const [previewSlug, setPreviewSlug] = useState(null);

  return (
    <div className="w-full min-w-0">
      <div className={cn(
        "grid w-full min-w-0 gap-4 sm:grid-cols-2",
        mobileCarousel ? "flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0" : "",
        className
      )}>
        {coachings.map((coaching) => (
          <div key={coaching.id} className={cn(
            "h-full",
            mobileCarousel ? "w-[290px] shrink-0 snap-start sm:w-auto" : "w-full"
          )}>
            <CoachingCard
              coaching={coaching}
              onPreview={() => setPreviewSlug(coaching.slug)}
              isSaved={savedIds.includes(coaching.id)}
              showActions={showActions}
            />
          </div>
        ))}
      </div>
      <CoachingPreviewSheet
        slug={previewSlug}
        open={!!previewSlug}
        onClose={() => setPreviewSlug(null)}
      />
    </div>
  );
}
