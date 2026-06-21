"use client";

import Link from "next/link";
import { motion } from "framer-motion";

function CheckIcon() {
  return (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function BenefitsSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-secondary">
            Value Proposition
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Why use CoachingHunt?
          </h2>
          <p className="mt-3 text-sm text-muted sm:text-base">
            We bridge the gap between ambitious students looking for clarity and top-tier institutes offering quality education.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* For Students Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-secondary/15 bg-gradient-to-b from-secondary-light/40 to-secondary-light/10 p-8 shadow-sm flex flex-col justify-between"
          >
            {/* Soft decorative background glow */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />
            
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                STUDENTS
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-foreground">Find clarity before you commit</h3>
              <p className="mt-1.5 text-sm text-secondary font-semibold">Make informed admission decisions.</p>
              
              <ul className="mt-6 space-y-3.5">
                <li className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-white shadow-xs">
                    <CheckIcon />
                  </span>
                  <span>Search institutes by city, locality, exam, and subjects.</span>
                </li>
                
                {/* Highlighted Compare Feature */}
                <li className="flex items-start gap-3 text-sm text-muted bg-white/70 border border-secondary/10 p-3.5 rounded-xl shadow-xs">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success text-white shadow-xs">
                    <CheckIcon />
                  </span>
                  <div>
                    <span className="font-bold text-foreground block text-xs tracking-wider uppercase text-secondary">
                      ⭐ Compare Tool Built-In
                    </span>
                    <span className="mt-1 block text-sm">
                      Select multiple coachings and compare fees, batch sizes, distance, and faculty side-by-side before booking.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-white shadow-xs">
                    <CheckIcon />
                  </span>
                  <span>Book direct demo sessions and get instant confirmation alerts.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-white shadow-xs">
                    <CheckIcon />
                  </span>
                  <span>Track your applications and demo schedules in a unified dashboard.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 border-t border-secondary/10 pt-5">
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:text-secondary-hover transition-colors group"
              >
                Create Student Account
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* For Coaching Institutes Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-border bg-white p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-foreground/10 px-3 py-1 text-[10px] font-bold tracking-wider text-foreground uppercase">
                COACHING OWNERS
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-foreground">Get discovered. Enroll students.</h3>
              <p className="mt-1.5 text-sm text-muted font-medium">Showcase what makes your institute stand out.</p>

              <ul className="mt-6 space-y-3.5">
                <li className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary-light text-secondary">
                    <CheckIcon />
                  </span>
                  <span>Create a rich digital profile with location, logo, and cover images.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary-light text-secondary">
                    <CheckIcon />
                  </span>
                  <span>Publish courses, batch schedules, fees, and subject categories.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary-light text-secondary">
                    <CheckIcon />
                  </span>
                  <span>List open demo class slots to collect high-intent student leads directly.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary-light text-secondary">
                    <CheckIcon />
                  </span>
                  <span>Manage admissions, reviews, and demo bookings in your custom CMS dashboard.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 border-t border-border/60 pt-5">
              <Link
                href="/signup/coaching"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:text-secondary-hover transition-colors group"
              >
                List Your Coaching Institute
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
