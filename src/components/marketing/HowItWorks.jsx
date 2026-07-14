"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const steps = [
  {
    tag: "SEARCH",
    title: "Find coachings near you",
    desc: "Search by your city and exam — JEE, NEET, Boards, and more. See verified institutes, not random pamphlets.",
    icon: (
      <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    tag: "COMPARE",
    title: "Compare before you visit",
    desc: "Check fees, batch size, schedule, and open demos side-by-side. Shortlist the coachings that actually fit your criteria.",
    icon: (
      <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    tag: "RESERVE",
    title: "Book a free demo",
    desc: "Pick a date and topic that fits your schedule. Get instant email confirmation with no agent callbacks.",
    icon: (
      <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    tag: "LEARN",
    title: "Attend and decide",
    desc: "Sit in a real class, evaluate the faculty, and ask your doubts. Choose only when you are 100% satisfied.",
    icon: (
      <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-secondary">
            Process
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Find the right coaching in 4 simple steps
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Skip the endless pamphlets and telephone calls. Take charge of your education with our transparent booking flow.
          </p>
        </div>

        {/* Mobile + Tablet: vertical step cards */}
        <ol className="mt-12 space-y-5 lg:hidden">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              {/* Step number and connection line */}
              <div className="flex flex-col items-center">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white shadow-md ring-4 ring-secondary-light">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div aria-hidden className="my-1.5 w-0.5 flex-1 min-h-[40px] bg-gradient-to-b from-secondary to-secondary/15" />
                )}
              </div>

              {/* Step content card */}
              <div className="flex-1 rounded-xl border border-border bg-white p-4.5 shadow-xs">
                <span className="text-[10px] font-bold tracking-wider text-secondary bg-secondary-light px-2 py-0.5 rounded-md">
                  {step.tag}
                </span>
                <h3 className="mt-2.5 text-base font-bold text-foreground">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* Desktop: horizontal flowchart */}
        <div className="relative mt-20 hidden gap-6 lg:grid lg:grid-cols-4">
          {/* Timeline Connector Line */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[12%] right-[12%] top-8 h-[2px] bg-gradient-to-r from-secondary-light via-secondary/20 to-secondary-light"
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="relative text-center group"
            >
              {/* Timeline dot icon container */}
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-light text-secondary shadow-md ring-4 ring-white transition-all duration-300 group-hover:scale-105 group-hover:bg-secondary group-hover:text-white">
                {step.icon}
                <span className="absolute -right-2.5 -top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white ring-4 ring-white group-hover:bg-indigo-600">
                  {i + 1}
                </span>
              </div>

              <span className="mt-6 inline-flex rounded-md bg-secondary-light px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-secondary uppercase">
                {step.tag}
              </span>

              <h3 className="mt-3 text-lg font-bold text-foreground group-hover:text-secondary transition-colors">
                {step.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted px-2">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <Link href="/search" className="inline-block w-full sm:w-auto">
            <Button size="lg" className="w-full min-h-12 sm:w-auto font-semibold">
              Start Searching Coachings
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
