"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { CoachingCoverImage, CoachingLogo } from "@/components/shared/CoachingMedia";
import { cn } from "@/lib/utils/cn";

function StarIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function formatDemoDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function CoachingPreviewSheet({ slug, open, onClose }) {
  const [coaching, setCoaching] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !slug) {
      setCoaching(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/coachings/${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (!json.success) {
          setError(json.message || "Could not load coaching details");
          setCoaching(null);
        } else {
          setCoaching(json.data);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load coaching details");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, slug]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const openDemos = coaching?.demoSlots?.filter((s) => s.status === "OPEN") ?? [];
  const courseCount = coaching?.courses?.length ?? 0;
  const reviewCount = coaching?.reviewCount ?? coaching?.reviews?.length ?? 0;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
        aria-hidden
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="coaching-preview-title"
        className={cn(
          "fixed z-50 flex flex-col bg-white shadow-2xl",
          "inset-x-0 bottom-0 max-h-[92vh] rounded-t-2xl",
          "md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:max-h-[88vh] md:w-full md:max-w-2xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl"
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 md:px-6">
          <p className="text-sm font-medium text-muted">Coaching details</p>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-muted transition hover:bg-secondary-light hover:text-foreground"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="space-y-4 p-4 md:p-6">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {error && !loading && (
            <div className="p-6 text-center">
              <p className="text-sm text-muted">{error}</p>
              <Button variant="secondary" className="mt-4 min-h-11" onClick={onClose}>
                Close
              </Button>
            </div>
          )}

          {coaching && !loading && (
            <>
              <div className="relative h-36 md:h-40">
                <CoachingCoverImage src={coaching.coverImageUrl} variant="hero" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-4 translate-y-1/2 md:left-6">
                  <CoachingLogo
                    src={coaching.logoUrl}
                    name={coaching.name}
                    size="md"
                    className="shadow-lg ring-4 ring-white"
                  />
                </div>
              </div>

              <div className="space-y-5 px-4 pb-4 pt-12 md:px-6 md:pb-6">
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 id="coaching-preview-title" className="text-xl font-bold text-foreground md:text-2xl">
                          {coaching.name}
                        </h2>
                        {coaching.verificationStatus === "VERIFIED" && (
                          <Badge variant="success">Verified</Badge>
                        )}
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                        <svg className="h-4 w-4 shrink-0 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {coaching.locality}, {coaching.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-secondary-light px-3 py-2">
                      <StarIcon className="h-4 w-4 text-warning" />
                      <span className="font-bold text-foreground">{coaching.avgRating?.toFixed(1) || "0.0"}</span>
                      <span className="text-sm text-muted">({reviewCount})</span>
                    </div>
                  </div>

                  {coaching.tagline && (
                    <p className="mt-3 text-base text-muted">{coaching.tagline}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 rounded-xl border border-border bg-secondary-light/40 px-4 py-3 text-sm">
                  <span>
                    <strong className="text-foreground">{courseCount}</strong>{" "}
                    course{courseCount !== 1 ? "s" : ""}
                  </span>
                  <span className="text-border">·</span>
                  <span className={openDemos.length > 0 ? "text-success" : "text-muted"}>
                    <strong className={openDemos.length > 0 ? "text-success" : "text-foreground"}>
                      {openDemos.length}
                    </strong>{" "}
                    demo{openDemos.length !== 1 ? "s" : ""} open
                  </span>
                  {coaching.foundedYear && (
                    <>
                      <span className="text-border">·</span>
                      <span>
                        Est. <strong className="text-foreground">{coaching.foundedYear}</strong>
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {coaching.category && <Badge variant="default">{coaching.category}</Badge>}
                  {coaching.mode && <Badge variant="default">{coaching.mode}</Badge>}
                  {coaching.targetExams?.map((exam) => (
                    <Badge key={exam} variant="primary">{exam}</Badge>
                  ))}
                </div>

                {coaching.subjects?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Subjects</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {coaching.subjects.map((subject) => (
                        <Badge key={subject} variant="default">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {coaching.description && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">About</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{coaching.description}</p>
                  </div>
                )}

                {coaching.facilities?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Facilities</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {coaching.facilities.map((facility) => (
                        <Badge key={facility} variant="default">{facility}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {coaching.courses?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Courses offered</p>
                    <ul className="mt-2 space-y-2">
                      {coaching.courses.slice(0, 4).map((course) => (
                        <li
                          key={course.id}
                          className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
                        >
                          <p className="font-medium text-foreground">{course.title}</p>
                          <p className="mt-0.5 text-muted">
                            {course.targetExams?.join(", ") || course.targetExam}
                            {course.durationText && ` · ${course.durationText}`}
                          </p>
                        </li>
                      ))}
                    </ul>
                    {coaching.courses.length > 4 && (
                      <p className="mt-2 text-xs text-muted">
                        +{coaching.courses.length - 4} more on full profile
                      </p>
                    )}
                  </div>
                )}

                {openDemos.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Upcoming demos</p>
                    <ul className="mt-2 space-y-2">
                      {openDemos.slice(0, 3).map((slot) => (
                        <li
                          key={slot.id}
                          className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm"
                        >
                          <span className="font-medium text-foreground">{slot.topic}</span>
                          <span className="text-muted">{formatDemoDate(slot.demoDate)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {coaching.reviews?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Recent reviews</p>
                    <div className="mt-2 space-y-2">
                      {coaching.reviews.slice(0, 2).map((review) => (
                        <div key={review.id} className="rounded-lg border border-border px-3 py-2.5 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.student?.user?.name || "Student"}</span>
                            <Badge variant="primary">
                              <StarIcon className="mr-0.5 inline h-3 w-3 text-warning" />
                              {review.rating}
                            </Badge>
                          </div>
                          {review.comment && (
                            <p className="mt-1.5 line-clamp-2 text-muted">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {coaching && !loading && (
          <div className="shrink-0 border-t border-border bg-white p-4 md:px-6">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href={`/coaching/${coaching.slug}`} className="flex-1" onClick={onClose}>
                <Button className="min-h-11 w-full" size="lg">
                  View full profile
                </Button>
              </Link>
              {openDemos.length > 0 && (
                <Link href={`/coaching/${coaching.slug}#coaching-demos`} className="flex-1" onClick={onClose}>
                  <Button variant="secondary" className="min-h-11 w-full" size="lg">
                    Book free demo
                  </Button>
                </Link>
              )}
            </div>
            <p className="mt-2 text-center text-xs text-muted">
              Sign in on the full profile to book demos and see contact details.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
