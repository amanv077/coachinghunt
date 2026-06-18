"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const steps = [
  {
    title: "Find coachings near you",
    desc: "Search by your city and exam — JEE, NEET, Boards, and more. See real institutes, not random pamphlets.",
    icon: (
      <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: "Compare before you visit",
    desc: "Check fees, batch timings, and ratings in one place. Shortlist the coachings that actually fit your budget and schedule.",
    icon: (
      <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Book a free demo",
    desc: "Pick a date and time that works for you. Get instant confirmation — no phone calls or waiting for a callback.",
    icon: (
      <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Attend and decide",
    desc: "Sit in a real class, meet the teachers, and ask your questions. Choose the coaching that feels right — not just the loudest ad.",
    icon: (
      <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
            How it works
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Find the right coaching in 4 simple steps
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">
            Skip the endless visits and guesswork. Search, compare, book a demo — then decide with confidence.
          </p>
        </div>

        {/* Mobile + tablet: vertical step cards */}
        <ol className="mt-10 space-y-3 sm:mt-12 lg:hidden">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-light shadow-sm">
                  {step.icon}
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div aria-hidden className="my-1 w-0.5 flex-1 min-h-4 bg-secondary/20" />
                )}
              </div>

              <div className="min-w-0 flex-1 rounded-xl border border-border bg-white p-4 shadow-sm">
                <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* Desktop: horizontal grid */}
        <div className="relative mt-16 hidden gap-8 lg:grid lg:grid-cols-4">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-10 h-0.5 bg-gradient-to-r from-transparent via-secondary/25 to-transparent"
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-light shadow-sm ring-4 ring-white">
                {step.icon}
              </div>
              <span className="mt-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center sm:mt-12">
          <Link href="/search" className="inline-block w-full sm:w-auto">
            <Button size="lg" className="w-full min-h-11 sm:w-auto">
              Find coachings near you
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
