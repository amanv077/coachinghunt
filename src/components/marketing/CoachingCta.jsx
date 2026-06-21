"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const stats = [
  { label: "Institutes listed", value: "500+" },
  { label: "Demo booking fee", value: "₹0 Free" },
  { label: "Student visibility", value: "Instant" },
];

export function CoachingCta() {
  return (
    <section className="navy-gradient relative overflow-hidden py-16 sm:py-24 text-white">
      {/* Radial overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
      
      {/* Decorative vector grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-widest text-secondary-muted uppercase"
          >
            GROW YOUR ACADEMY
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Are you a coaching institute owner?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            viewport={{ once: true }}
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base"
          >
            Join the platform today to list your courses, display batch sizes, and accept demo class bookings directly from verified student leads.
          </motion.p>
        </div>

        {/* Feature quick stats for institutes */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4 border-y border-white/10 py-8 text-center"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-xl font-extrabold sm:text-3xl text-white">{stat.value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-secondary-muted sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/signup/coaching" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="secondary"
              className="w-full min-h-12 bg-white text-secondary hover:bg-secondary-light border-0 font-bold px-8 shadow-md"
            >
              List Your Institute - Free
            </Button>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="ghost"
              className="w-full min-h-12 border border-white/20 text-white hover:bg-white/10 hover:text-white font-semibold px-8"
            >
              Contact Support
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
