"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

const roles = [
  {
    id: "student",
    href: "/signup/student",
    label: "Student",
    description: "Find coachings & book demos",
    icon: (className) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    )
  },
  {
    id: "coaching",
    href: "/signup/coaching",
    label: "Institute",
    description: "List your coaching classes",
    icon: (className) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
];

export function SignupRoleTabs({ active }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-2xl border border-border bg-white p-1.5 shadow-sm">
      {roles.map((role) => {
        const isActive = active === role.id;
        return (
          <Link
            key={role.id}
            href={role.href}
            className={cn(
              "relative flex min-h-12 flex-col items-center justify-center rounded-xl px-3 py-2 text-center transition duration-200 select-none outline-hidden",
              isActive ? "" : "text-muted hover:text-foreground"
            )}
          >
            {/* Sliding background */}
            {isActive && (
              <motion.span
                layoutId="activeRoleTab"
                className="absolute inset-0 rounded-xl bg-secondary shadow-xs"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}

            <div className="relative z-10 flex items-center gap-1.5">
              {role.icon(
                cn(
                  "h-4 w-4 transition-colors duration-200",
                  isActive ? "text-white" : "text-muted/80 group-hover:text-foreground"
                )
              )}
              <span className={cn("text-sm font-semibold transition-colors duration-200", isActive ? "text-white" : "text-foreground")}>
                {role.label}
              </span>
            </div>
            
            <span
              className={cn(
                "relative z-10 mt-0.5 text-[11px] font-medium transition-colors duration-200",
                isActive ? "text-white/80" : "text-muted"
              )}
            >
              {role.description}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

