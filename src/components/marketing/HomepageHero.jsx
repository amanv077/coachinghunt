"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const quickFilters = ["JEE", "NEET", "Boards", "Foundation"];

const stats = [
  {
    value: "500+",
    label: "Coachings listed",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    value: "10k+",
    label: "Demo bookings",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    value: "50+",
    label: "Cities covered",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const trustBadges = [
  { label: "Free to use", icon: "✓" },
  { label: "Verified institutes", icon: "✓" },
  { label: "Instant confirmation", icon: "✓" },
];

export function HomepageHero() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    router.push(`/search?${params.toString()}`);
  }

  function quickSearch(exam) {
    router.push(`/search?targetExam=${encodeURIComponent(exam)}`);
  }

  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-secondary-muted/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center rounded-full border border-secondary/20 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary"
          >
            India&apos;s coaching discovery platform
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Find the right coaching.
            <span className="mt-1 block text-secondary">Book a demo in minutes.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Compare offline institutes, explore courses and batches, and reserve demo sessions — all in one place.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="glass-card rounded-2xl p-2 shadow-lg">
            <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <input
                type="text"
                placeholder="Search coaching or exam..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className={cn(
                  "min-h-[52px] flex-1 rounded-xl border border-secondary/30 bg-white px-5 text-sm outline-none sm:min-w-[140px]",
                  "placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                )}
              />
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={cn(
                  "min-h-[52px] w-full rounded-xl border border-secondary/30 bg-white px-5 text-sm outline-none sm:w-auto sm:min-w-[120px] sm:flex-none",
                  "placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                )}
              />
              <Button type="submit" size="lg" className="min-h-[52px] w-full rounded-xl px-8 sm:w-auto sm:shrink-0">
                Search
              </Button>
            </form>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium text-muted">Popular:</span>
            {quickFilters.map((exam) => (
              <button
                key={exam}
                type="button"
                onClick={() => quickSearch(exam)}
                className="min-h-9 cursor-pointer rounded-full border border-secondary/20 bg-white px-3.5 py-1.5 text-xs font-medium text-secondary transition hover:border-secondary hover:bg-secondary-light"
              >
                {exam}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4 sm:gap-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary-light text-secondary">
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-secondary sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6"
        >
          {trustBadges.map((badge) => (
            <span
              key={badge.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-secondary/15 bg-white/70 px-3 py-1.5 text-xs font-medium text-foreground"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/15 text-[10px] font-bold text-success">
                {badge.icon}
              </span>
              {badge.label}
            </span>
          ))}
        </motion.div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link
            href="/signup/student"
            className="font-semibold text-secondary underline-offset-4 hover:underline"
          >
            Join as Student →
          </Link>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <Link
            href="/signup/coaching"
            className="font-semibold text-secondary underline-offset-4 hover:underline"
          >
            List your institute →
          </Link>
        </div>
      </div>
    </section>
  );
}
