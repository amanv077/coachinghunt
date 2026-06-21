"use client";

import { Badge } from "@/components/ui/Badge";
import { SaveCoachingButton } from "@/components/shared/SaveCoachingButton";
import { CompareCoachingButton } from "@/components/shared/CompareCoachingButton";
import { CoachingCoverImage, CoachingLogo } from "@/components/shared/CoachingMedia";
import { cn } from "@/lib/utils/cn";

function StarIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function MapPinIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function BookIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

export function CoachingCard({ coaching, onPreview, isSaved = false, showActions = false }) {
  const demoCount = coaching.openDemoCount ?? coaching._count?.demoSlots ?? 0;
  const courseCount = coaching.courseCount ?? coaching._count?.courses ?? 0;

  const cardContent = (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-secondary/30 hover:shadow-lg">
      <div className="relative h-28">
        <CoachingCoverImage src={coaching.coverImageUrl} variant="card" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(44,76,156,0.15),transparent_60%)]" />
        <div className="absolute bottom-0 left-5 translate-y-1/2">
          <CoachingLogo
            src={coaching.logoUrl}
            name={coaching.name}
            size="sm"
            className="shadow-md ring-4 ring-white"
          />
        </div>
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {showActions && (
            <div className="flex gap-2">
              <SaveCoachingButton coachingId={coaching.id} initialSaved={isSaved} />
            </div>
          )}
          {coaching.verificationStatus === "VERIFIED" && (
            <Badge variant="success">Verified</Badge>
          )}
          {coaching.isFeatured && (
            <Badge variant="warning">Featured</Badge>
          )}
          {demoCount > 0 && (
            <Badge variant="primary" className="bg-white/95 text-secondary shadow-sm">
              {demoCount} demo{demoCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 pt-10">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground transition group-hover:text-secondary">
            {coaching.name}
          </h3>
          <span className="flex shrink-0 items-center gap-0.5 text-sm font-semibold text-secondary">
            <StarIcon className="h-3.5 w-3.5 text-warning" />
            {coaching.avgRating?.toFixed(1) || "0.0"}
          </span>
        </div>

        <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
          <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-secondary" />
          {[coaching.locality, coaching.city].filter(Boolean).join(", ") || "Location not listed"}
        </p>

        {coaching.tagline && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {coaching.tagline}
          </p>
        )}

        {!coaching.tagline && coaching.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {coaching.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {coaching.targetExams?.slice(0, 3).map((exam) => (
            <Badge key={exam} variant="primary">{exam}</Badge>
          ))}
          {coaching.subjects?.slice(0, 2).map((subject) => (
            <Badge key={subject} variant="default">{subject}</Badge>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
          {courseCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <BookIcon className="h-3.5 w-3.5 text-secondary" />
              {courseCount} course{courseCount !== 1 ? "s" : ""}
            </span>
          )}
          {coaching.category && (
            <span className="rounded-full bg-secondary-light px-2 py-0.5 font-medium text-secondary">
              {coaching.category}
            </span>
          )}
          {coaching.mode && (
            <span>{coaching.mode}</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div className="space-y-1">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium",
                demoCount > 0 ? "text-success" : "text-muted"
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", demoCount > 0 ? "bg-success" : "bg-border")} />
              {demoCount > 0 ? "Demos available" : "No demos yet"}
            </span>
            {coaching.avgResponseHours != null && (
              <p className="text-xs text-secondary">Responds in ~{coaching.avgResponseHours}h</p>
            )}
          </div>
          <span className="text-xs font-medium text-secondary">
            {coaching.reviewCount || 0} review{(coaching.reviewCount || 0) !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="mt-3">
          <CompareCoachingButton coaching={coaching} />
        </div>

        <p className="mt-3 text-xs font-medium text-secondary md:opacity-0 md:transition md:group-hover:opacity-100">
          Tap for details →
        </p>
      </div>
    </article>
  );

  if (onPreview) {
    function handleCardClick(e) {
      if (e.target.closest("button, a")) return;
      onPreview();
    }

    return (
      <div
        onClick={handleCardClick}
        className="group block h-full w-full min-w-0 cursor-pointer text-left"
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
}
