"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { CityAutocomplete } from "@/components/shared/CityAutocomplete";
import {
  TRUST_STATS,
  TRUST_ACTIVITY_LINE,
  resolveStatDisplay,
} from "@/lib/marketing/trust-stats";

const quickFilters = ["JEE", "NEET", "Boards", "Foundation"];
const popularCities = ["Indore", "Bhopal", "Delhi", "Kota", "Jaipur"];

const statIcons = {
  coachings: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  bookings: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  cities: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

function buildStats(stats = {}) {
  return [
    {
      value: resolveStatDisplay(stats.coachings, TRUST_STATS.coachings),
      label: TRUST_STATS.coachings.label,
      icon: statIcons.coachings,
    },
    {
      value: resolveStatDisplay(stats.bookings, TRUST_STATS.bookings),
      label: TRUST_STATS.bookings.label,
      icon: statIcons.bookings,
    },
    {
      value: resolveStatDisplay(stats.cities, TRUST_STATS.cities),
      label: TRUST_STATS.cities.label,
      icon: statIcons.cities,
    },
  ];
}

const trustBadges = [
  {
    label: "100% Free to use",
    icon: (
      <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    label: "Verified institutes",
    icon: (
      <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Instant demo confirmation",
    icon: (
      <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export function HomepageHero({ stats: platformStats }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const stats = buildStats(platformStats);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q.trim());
    if (city) params.set("city", city.trim());
    router.push(`/search?${params.toString()}`);
  }

  function quickSearch(exam) {
    router.push(`/exams/${encodeURIComponent(exam.toLowerCase())}`);
  }

  function selectCity(cityName) {
    const params = new URLSearchParams();
    if (q) params.set("q", q.trim());
    params.set("city", cityName);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <section className="hero-gradient relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-secondary-muted/35 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            India&apos;s coaching discovery platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Find the right coaching.
            <span className="mt-2 block bg-gradient-to-r from-secondary to-indigo-600 bg-clip-text text-transparent">
              Book a demo in minutes.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted sm:text-base md:text-lg"
          >
            Discover verified offline institutes near you, compare fees and batch timings, and book a free demo class — simple, transparent, and direct.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-10 max-w-3xl overflow-visible"
        >
          <div className="glass-card overflow-visible rounded-2xl border border-secondary/15 p-2.5 shadow-xl md:rounded-full">
            <form onSubmit={handleSearch} className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="relative flex min-h-[52px] flex-1 items-center">
                <div className="absolute left-4 text-secondary/60">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search coaching name, exam, or subjects..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  autoComplete="off"
                  aria-label="Search coachings"
                  className="h-full w-full rounded-xl bg-transparent pl-12 pr-4 text-sm font-medium text-foreground outline-none placeholder:text-muted md:rounded-none"
                />
              </div>

              <div className="mx-4 h-px bg-border/60 md:hidden" />
              <div className="hidden h-8 w-px shrink-0 bg-border md:block" />

              <div className="relative flex min-h-[52px] items-center md:w-56">
                <div className="pointer-events-none absolute left-4 z-10 text-secondary/60">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <CityAutocomplete
                  label={null}
                  name="city"
                  value={city}
                  onChange={setCity}
                  placeholder="Enter city..."
                  variant="plain"
                  className="w-full"
                  inputClassName="h-full pl-12 pr-4 font-medium placeholder:text-muted"
                />
              </div>

              <Button type="submit" size="lg" className="min-h-[52px] w-full shrink-0 rounded-xl px-8 font-semibold md:w-auto md:rounded-full">
                Find Coachings
              </Button>
            </form>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-muted">Popular Exams:</span>
            {quickFilters.map((exam) => (
              <button
                key={exam}
                type="button"
                onClick={() => quickSearch(exam)}
                className="min-h-9 cursor-pointer rounded-full border border-secondary/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-secondary transition-all hover:border-secondary hover:bg-secondary-light hover:shadow-sm"
              >
                {exam}
              </button>
            ))}
          </div>

          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-muted">Top Cities:</span>
            {popularCities.map((cityName) => (
              <button
                key={cityName}
                type="button"
                onClick={() => selectCity(cityName)}
                className="min-h-8 cursor-pointer rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground transition-all hover:border-secondary hover:bg-secondary-light hover:text-secondary"
              >
                {cityName}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-12 flex flex-col items-center justify-center gap-4 border-t border-border/60 pt-10 sm:flex-row sm:gap-8"
        >
          {trustBadges.map((badge) => (
            <span
              key={badge.label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold text-foreground/80 shadow-xs"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                {badge.icon}
              </span>
              {badge.label}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mx-auto mt-14 max-w-4xl rounded-2xl border border-border bg-white/60 p-6 shadow-xs"
        >
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="group text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary-light text-secondary transition-all group-hover:scale-110">
                  {stat.icon}
                </div>
                <p className="text-xl font-extrabold text-foreground sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted sm:text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-muted">
            <span className="flex h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            {TRUST_ACTIVITY_LINE}
          </p>
        </motion.div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-sm font-medium sm:flex-row">
          <Link
            href="/signup"
            className="flex items-center gap-1.5 font-semibold text-secondary underline decoration-secondary/30 underline-offset-4 hover:text-secondary-hover hover:decoration-secondary"
          >
            Create Free Student Profile
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <Link
            href="/signup/coaching"
            className="flex items-center gap-1.5 font-semibold text-secondary underline decoration-secondary/30 underline-offset-4 hover:text-secondary-hover hover:decoration-secondary"
          >
            List Your Coaching Institute
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
