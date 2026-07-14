"use client";

import Link from "next/link";
import { useCompare } from "@/components/shared/CompareContext";
import { cn } from "@/lib/utils/cn";

/**
 * Compare nav link that always points to a useful destination:
 * - 2+ items → /compare?ids=...
 * - otherwise → /student/saved (or /search for guests)
 */
export function CompareNavLink({
  className,
  children = "Compare",
  guestFallback = "/search",
  studentFallback = "/student/saved",
  isStudent = false,
  onClick,
}) {
  const { compareList } = useCompare();
  const href =
    compareList.length >= 2
      ? `/compare?ids=${compareList.map((item) => item.id).join(",")}`
      : isStudent
        ? studentFallback
        : guestFallback;

  return (
    <Link href={href} className={cn(className)} onClick={onClick}>
      {typeof children === "function" ? children(compareList.length) : children}
    </Link>
  );
}
