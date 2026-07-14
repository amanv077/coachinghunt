"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { examToSlug } from "@/lib/seo/constants";

const examDetails = [
  {
    name: "JEE",
    desc: "IITs & top engineering college entry prep.",
    color: "from-blue-500 to-indigo-600",
    lightColor: "bg-blue-50 border-blue-100 text-blue-700",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    name: "NEET",
    desc: "Top medical colleges admission courses.",
    color: "from-rose-500 to-pink-600",
    lightColor: "bg-rose-50 border-rose-100 text-rose-700",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    name: "Boards",
    desc: "Class 10th & 12th state/national boards.",
    color: "from-amber-500 to-orange-600",
    lightColor: "bg-amber-50 border-amber-100 text-amber-700",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    name: "Foundation",
    desc: "Base concepts for Class 6th to 9th standard.",
    color: "from-emerald-500 to-teal-600",
    lightColor: "bg-emerald-50 border-emerald-100 text-emerald-700",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    name: "UPSC",
    desc: "Civil Services & prestigious officer exams.",
    color: "from-purple-500 to-violet-600",
    lightColor: "bg-purple-50 border-purple-100 text-purple-700",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    name: "CA",
    desc: "Chartered Accountancy & finance streams.",
    color: "from-cyan-500 to-sky-600",
    lightColor: "bg-cyan-50 border-cyan-100 text-cyan-700",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "CLAT",
    desc: "Law entrance & legal studies preparation.",
    color: "from-orange-500 to-amber-600",
    lightColor: "bg-orange-50 border-orange-100 text-orange-700",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
];

export function ExamCategories({ counts = {} }) {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-secondary">
            Find by Goal
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Choose your target exam
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted sm:text-base">
            Skip the confusion. Jump directly to verified coaching institutes catering to your exact prep goals.
          </p>
        </div>

        {/* Scrollable list on mobile, grid on desktop */}
        <div className="mt-10 -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-none md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-4">
          {examDetails.map((exam, i) => {
            const count = counts[exam.name] ?? 0;
            const slug = examToSlug(exam.name);

            return (
              <motion.div
                key={exam.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="w-[280px] shrink-0 snap-start md:w-auto"
              >
                <Link
                  href={`/exams/${slug}`}
                  className="group block h-full rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary/35 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${exam.color} text-white shadow-sm`}>
                      {exam.icon}
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${exam.lightColor}`}>
                      {count > 0
                        ? `${count} ${count === 1 ? "Institute" : "Institutes"}`
                        : "Growing"}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-foreground group-hover:text-secondary transition-colors">
                    {exam.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
                    {exam.desc}
                  </p>

                  <div className="mt-6 flex items-center text-xs font-semibold text-secondary">
                    <span>Explore coachings</span>
                    <svg className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
