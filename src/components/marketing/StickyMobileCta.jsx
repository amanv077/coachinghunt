"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCompare } from "@/components/shared/CompareContext";

/**
 * Sticky find-coachings CTA for mobile homepage visitors.
 * Hidden when CompareBar is active so the two never stack awkwardly.
 */
export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);
  const { compareList } = useCompare();
  const compareActive = compareList.length > 0;

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 420);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible || compareActive) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[65] border-t border-border bg-white/95 p-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
      <Link href="/search" className="block">
        <Button className="min-h-12 w-full rounded-xl font-semibold shadow-sm">
          Find Coachings
        </Button>
      </Link>
    </div>
  );
}
