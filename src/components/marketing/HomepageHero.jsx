"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const quickFilters = ["JEE", "NEET", "Boards", "Foundation"];

const stats = [
  { value: "500+", label: "Coachings listed" },
  { value: "10k+", label: "Demo bookings" },
  { value: "50+", label: "Cities covered" },
];

export function HomepageHero() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q)}`);
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
            <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                placeholder="Search coaching, city, exam..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className={cn(
                  "min-h-[52px] flex-1 rounded-xl border-0 bg-white px-5 text-sm outline-none",
                  "placeholder:text-muted focus:ring-2 focus:ring-secondary/25"
                )}
              />
              <Button type="submit" size="lg" className="min-h-[52px] rounded-xl px-8 sm:shrink-0">
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
                className="rounded-full border border-secondary/20 bg-white px-3.5 py-1.5 text-xs font-medium text-secondary transition hover:border-secondary hover:bg-secondary-light"
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
              <p className="text-2xl font-bold text-secondary sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</p>
            </div>
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
