"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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

export function TestimonialsSection({ reviews = [] }) {
  return (
    <section className="bg-surface-muted py-16 sm:py-24 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header Block */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-secondary">
              Student Stories
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Trusted by students across India
            </h2>
            <p className="mt-2.5 max-w-lg text-sm text-muted">
              Real, unedited feedback from students who scheduled demo classes and got admitted through CoachingHunt.
            </p>
          </div>
          
          {reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary/70 md:hidden animate-pulse">
                Swipe to read
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <Card className="mx-auto mt-12 max-w-md text-center border-dashed border-2 border-border/80">
            <p className="text-lg font-bold text-foreground">Be the first to share your story</p>
            <p className="mt-2 text-sm text-muted">
              Book a direct demo session, attend the class, and write a review to help other students choose the best institute.
            </p>
            <Link href="/search" className="mt-6 inline-block w-full">
              <Button className="min-h-11 w-full font-semibold">Browse Coaching Institutes</Button>
            </Link>
          </Card>
        ) : (
          /* Scrollable Carousel on mobile, 3-column Grid on desktop */
          <div className="mt-10 -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-none md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-3">
            {reviews.map((review, i) => {
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
                  className="w-[300px] shrink-0 snap-start rounded-2xl border border-border bg-white p-6 shadow-sm flex flex-col justify-between md:w-auto transition-all duration-300 hover:border-secondary/20 hover:shadow-md"
                >
                  <div>
                    {/* Stars and Verification Badge */}
                    <div className="flex items-center justify-between">
                      <StarRating rating={review.rating} />
                      {review.bookingId && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Verified Demo
                        </span>
                      )}
                    </div>

                    {/* Quotation text */}
                    <div className="relative mt-4">
                      {/* Giant quotation mark in background */}
                      <span className="absolute -left-2 -top-4 text-6xl font-serif text-secondary/5 pointer-events-none select-none">
                        “
                      </span>
                      <blockquote className="relative text-sm leading-relaxed text-muted line-clamp-4 z-10 italic">
                        &ldquo;{review.comment}&rdquo;
                      </blockquote>
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarGrad} text-sm font-bold text-white shadow-xs`}>
                      {getInitials(name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{name}</p>
                      <p className="text-xs text-muted font-medium truncate">
                        {exam} · {city}
                      </p>
                      {review.coaching?.name && (
                        <p className="text-xs text-secondary font-bold truncate hover:underline mt-0.5">
                          <Link href={`/coaching/${review.coaching.slug || review.coaching.id}`}>
                            {review.coaching.name}
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
