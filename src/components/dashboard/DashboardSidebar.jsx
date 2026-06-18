"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export function DashboardSidebar({ items, title }) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-r border-border bg-white md:w-64">
      <div className="border-b border-border px-4 py-5">
        <p className="text-xs uppercase tracking-wide text-muted">Dashboard</p>
        <h2 className="text-lg font-semibold text-secondary">{title}</h2>
      </div>
      <nav className="space-y-1 p-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-lg px-3 py-2 text-sm transition",
              pathname === item.href
                ? "bg-secondary-light font-medium text-secondary"
                : "text-muted hover:bg-surface-muted hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
