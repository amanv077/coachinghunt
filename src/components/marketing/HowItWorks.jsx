"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Search",
    desc: "Filter by city, exam, or subject to find relevant institutes near you.",
    icon: "🔍",
  },
  {
    title: "Compare",
    desc: "Review courses, fees, schedules, and ratings side by side.",
    icon: "📊",
  },
  {
    title: "Book Demo",
    desc: "Pick a demo slot and get instant confirmation with booking details.",
    icon: "📅",
  },
  {
    title: "Decide",
    desc: "Attend the session and choose the coaching that fits you best.",
    icon: "✓",
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
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-10 hidden h-0.5 bg-secondary/15 lg:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-light text-2xl shadow-sm ring-4 ring-white">
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
