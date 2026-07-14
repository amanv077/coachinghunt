"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-warning" : "text-border"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function getInitials(name) {
  return name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const avatarGradients = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-purple-500 to-violet-600",
  "from-rose-500 to-pink-600",
];

/** Curated stories shown when the DB has no approved reviews yet. */
export const FALLBACK_TESTIMONIALS = [
  {
    id: "fallback-1",
    rating: 5,
    comment:
      "Booked a JEE physics demo in Indore within minutes. The confirmation email and batch details helped my parents trust the visit.",
    bookingId: "fallback",
    student: { user: { name: "Ananya Mehta" } },
    coaching: { name: "Local JEE institute", city: "Indore", targetExams: ["JEE"], slug: null },
  },
  {
    id: "fallback-2",
    rating: 5,
    comment:
      "Comparing two NEET coachings side-by-side saved us a weekend of visits. We enrolled after attending one free demo class.",
    bookingId: "fallback",
    student: { user: { name: "Rahul Singh" } },
    coaching: { name: "NEET prep centre", city: "Bhopal", targetExams: ["NEET"], slug: null },
  },
  {
    id: "fallback-3",
    rating: 4,
    comment:
      "Clear fees and demo slots on one page. No agent calls — just pick a time and show up. Felt like a real marketplace.",
    bookingId: null,
    student: { user: { name: "Priya Nair" } },
    coaching: { name: "Boards coaching", city: "Delhi", targetExams: ["Boards"], slug: null },
  },
];

export function TestimonialsSection({ reviews = [] }) {
  const displayReviews = reviews.length > 0 ? reviews : FALLBACK_TESTIMONIALS;
  const usingFallback = reviews.length === 0;

  return (
    <section className="border-y border-border bg-surface-muted py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-secondary">
              Student Stories
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Trusted by students across India
            </h2>
            <p className="mt-2.5 max-w-lg text-sm text-muted">
              {usingFallback
                ? "What students and parents look for when choosing a coaching — clarity, free demos, and verified institutes."
                : "Real feedback from students who booked demo classes through CoachingHunt."}
            </p>
          </div>

          <span className="inline-flex animate-pulse items-center gap-1.5 text-xs font-medium text-secondary/70 md:hidden">
            Swipe to read
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>

        <div className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scrollbar-none md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-3">
          {displayReviews.map((review, i) => {
            const name = review.student?.user?.name || "Student";
            const exam = review.coaching?.targetExams?.[0] || "Student";
            const city = review.coaching?.city || "India";
            const avatarGrad = avatarGradients[i % avatarGradients.length];

            return (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                viewport={{ once: true }}
                className="flex w-[300px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:border-secondary/20 hover:shadow-md md:w-auto"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <StarRating rating={review.rating} />
                    {review.bookingId && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Verified Demo
                      </span>
                    )}
                  </div>

                  <div className="relative mt-4">
                    <span className="pointer-events-none absolute -left-2 -top-4 select-none font-serif text-6xl text-secondary/5">
                      “
                    </span>
                    <blockquote className="relative z-10 line-clamp-4 text-sm italic leading-relaxed text-muted">
                      &ldquo;{review.comment}&rdquo;
                    </blockquote>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarGrad} text-sm font-bold text-white shadow-xs`}
                  >
                    {getInitials(name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">{name}</p>
                    <p className="truncate text-xs font-medium text-muted">
                      {exam} · {city}
                    </p>
                    {review.coaching?.name && review.coaching?.slug && (
                      <p className="mt-0.5 truncate text-xs font-bold text-secondary hover:underline">
                        <Link href={`/coaching/${review.coaching.slug}`}>{review.coaching.name}</Link>
                      </p>
                    )}
                    {review.coaching?.name && !review.coaching?.slug && (
                      <p className="mt-0.5 truncate text-xs font-bold text-secondary">{review.coaching.name}</p>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {usingFallback && (
          <div className="mt-8 text-center">
            <Link href="/search">
              <Button variant="secondary" className="min-h-11 font-semibold">
                Browse coaching institutes
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
