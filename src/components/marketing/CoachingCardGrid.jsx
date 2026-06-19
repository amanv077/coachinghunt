"use client";

import { useState } from "react";
import { CoachingCard } from "@/components/marketing/CoachingCard";
import { CoachingPreviewSheet } from "@/components/marketing/CoachingPreviewSheet";
import { cn } from "@/lib/utils/cn";

export function CoachingCardGrid({ coachings, className, savedIds = [], showActions = false }) {
  const [previewSlug, setPreviewSlug] = useState(null);

  return (
    <>
      <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
        {coachings.map((coaching) => (
          <CoachingCard
            key={coaching.id}
            coaching={coaching}
            onPreview={() => setPreviewSlug(coaching.slug)}
            isSaved={savedIds.includes(coaching.id)}
            showActions={showActions}
          />
        ))}
      </div>
      <CoachingPreviewSheet
        slug={previewSlug}
        open={!!previewSlug}
        onClose={() => setPreviewSlug(null)}
      />
    </>
  );
}
