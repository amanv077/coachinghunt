"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CoachingLogo } from "@/components/shared/CoachingMedia";

/**
 * Mobile compare: sticky label column + horizontally snap-scrolling coaching columns
 * so two institutes can be compared at a glance on a phone.
 */
export function MobileCompareView({ ordered, rows }) {
  return (
    <div className="mt-6 md:hidden">
      <p className="mb-3 text-xs font-medium text-muted">Swipe sideways to compare columns</p>
      <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm snap-x snap-mandatory">
        <div className="inline-flex min-w-full">
          <div className="sticky left-0 z-20 w-[108px] shrink-0 border-r border-border bg-surface-muted">
            <div className="flex h-[108px] items-end border-b border-border p-3">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">Feature</span>
            </div>
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex min-h-[56px] items-center border-b border-border px-3 py-2 text-xs font-medium text-muted last:border-b-0"
              >
                {row.label}
              </div>
            ))}
            <div className="min-h-[64px] border-t border-border px-3 py-2" />
          </div>

          {ordered.map((coaching, colIndex) => (
            <div
              key={coaching.id}
              className="w-[min(70vw,220px)] shrink-0 snap-start border-r border-border last:border-r-0"
            >
              <div className="flex h-[108px] flex-col justify-between border-b border-border p-3">
                <div className="flex items-start gap-2">
                  <CoachingLogo src={coaching.logoUrl} name={coaching.name} size="sm" className="!h-10 !w-10" />
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold text-foreground">{coaching.name}</p>
                    {coaching.verificationStatus === "VERIFIED" && (
                      <Badge variant="success" className="mt-1">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {rows.map((row) => (
                <div
                  key={`${coaching.id}-${row.label}`}
                  className="flex min-h-[56px] items-center border-b border-border px-3 py-2 text-sm font-medium text-foreground last:border-b-0"
                >
                  {row.values[colIndex]}
                </div>
              ))}
              <div className="border-t border-border p-3">
                <Link href={`/coaching/${coaching.slug}`}>
                  <Button size="sm" className="min-h-10 w-full">
                    View profile
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
