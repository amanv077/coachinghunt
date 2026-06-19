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

export function TestimonialsSection({ reviews = [] }) {
  return (
    <section className="bg-surface-muted py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Student stories
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by students across India
          </h2>
          <p className="mt-4 text-muted">
            Real experiences from students who found their coaching through CoachingHunt.
          </p>
        </div>

        {reviews.length === 0 ? (
          <Card className="mx-auto mt-12 max-w-lg text-center">
            <p className="text-lg font-semibold text-foreground">Be the first to share your story</p>
            <p className="mt-2 text-sm text-muted">
              Book a demo, attend a session, and leave a review to help other students choose wisely.
            </p>
            <Link href="/search" className="mt-6 inline-block w-full sm:w-auto">
              <Button className="min-h-11 w-full sm:w-auto">Find coachings</Button>
            </Link>
          </Card>
        ) : (
          <div className="mt-12 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
            {reviews.map((review, i) => {
              const name = review.student?.user?.name || "Student";
              const exam = review.coaching?.targetExams?.[0] || "Student";
              const city = review.coaching?.city || "India";

              return (
                <motion.article
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="min-w-[280px] flex-shrink-0 snap-start rounded-2xl border border-border bg-white p-6 shadow-sm lg:min-w-0"
                >
                  <StarRating rating={review.rating} />
                  <blockquote className="mt-4 text-sm leading-relaxed text-muted">
                    &ldquo;{review.comment}&rdquo;
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white">
                      {getInitials(name)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{name}</p>
                      <p className="text-xs text-muted">
                        {exam} · {city}
                      </p>
                      {review.coaching?.name && (
                        <p className="text-xs text-secondary">{review.coaching.name}</p>
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
