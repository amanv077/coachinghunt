"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const roles = [
  {
    id: "student",
    href: "/signup/student",
    label: "Student",
    description: "Find coachings & book demos",
  },
  {
    id: "coaching",
    href: "/signup/coaching",
    label: "Coaching",
    description: "List your institute",
  },
];

export function SignupRoleTabs({ active }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-border bg-white p-1">
      {roles.map((role) => {
        const isActive = active === role.id;
        return (
          <Link
            key={role.id}
            href={role.href}
            className={cn(
              "flex min-h-11 flex-col items-center justify-center rounded-lg px-3 py-2 text-center transition",
              isActive
                ? "bg-secondary text-white shadow-sm"
                : "text-muted hover:bg-surface-muted hover:text-foreground"
            )}
          >
            <span className="text-sm font-semibold">{role.label}</span>
            <span
              className={cn(
                "mt-0.5 text-xs",
                isActive ? "text-white/85" : "text-muted"
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
