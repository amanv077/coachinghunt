"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

const FAQ_ITEMS = [
  {
    q: "Is CoachingHunt free for students?",
    a: "Yes. Searching institutes, comparing options, and booking demo sessions is completely free for students. There are no hidden booking fees.",
  },
  {
    q: "How are coaching institutes verified?",
    a: "Every public listing goes through our verification checks before it appears in search. Verified institutes show a green Verified badge on their profile and cards.",
  },
  {
    q: "What happens after I book a demo?",
    a: "You get an instant confirmation with a booking code, date, and time. The coaching is notified, and you can track the booking from your student dashboard.",
  },
  {
    q: "Can I cancel or reschedule a demo?",
    a: "Yes. From My Bookings you can cancel or request a reschedule before the demo starts, subject to the institute’s availability.",
  },
  {
    q: "Do coaching owners need to pay to list?",
    a: "Creating a coaching profile and listing courses is free to get started. Paid featuring options may be offered later to boost visibility.",
  },
  {
    q: "Do I need an account to browse?",
    a: "No. You can search and view coaching profiles without signing up. An account is only needed when you book a demo or save institutes.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-secondary">
            FAQ
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Questions students ask before signing up
          </h2>
          <p className="mt-2 text-sm text-muted">
            Straight answers so you know exactly how CoachingHunt works.
          </p>
        </div>

        <div className="mt-8 space-y-2">
          {FAQ_ITEMS.map((item, index) => {
            const open = openIndex === index;
            return (
              <div
                key={item.q}
                className={cn(
                  "rounded-2xl border bg-white transition",
                  open ? "border-secondary/25 shadow-sm" : "border-border"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5"
                  aria-expanded={open}
                >
                  <span className="text-sm font-semibold text-foreground sm:text-base">{item.q}</span>
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-light text-secondary transition",
                      open && "bg-secondary text-white"
                    )}
                  >
                    <svg
                      className={cn("h-4 w-4 transition-transform", open && "rotate-45")}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                {open && (
                  <div className="border-t border-border/70 px-4 pb-4 pt-3 text-sm leading-relaxed text-muted sm:px-5">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
