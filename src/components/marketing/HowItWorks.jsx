"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Search",
    desc: "Filter by city, exam, or subject to find relevant institutes near you.",
    icon: (
      <svg className="h-7 w-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: "Compare",
    desc: "Review courses, fees, schedules, and ratings side by side.",
    icon: (
      <svg className="h-7 w-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Book Demo",
    desc: "Pick a demo slot and get instant confirmation with booking details.",
    icon: (
      <svg className="h-7 w-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Decide",
    desc: "Attend the session and choose the coaching that fits you best.",
    icon: (
      <svg className="h-7 w-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Simple process
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How CoachingHunt works
          </h2>
          <p className="mt-4 text-muted">
            From discovery to demo booking — four clear steps to find your perfect coaching.
          </p>
        </div>

        <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-10 hidden h-0.5 bg-gradient-to-r from-transparent via-secondary/25 to-transparent lg:block" />

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
      </div>
    </section>
  );
}
