"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

function NavLink({ item, pathname, variant }) {
  const isActive = pathname === item.href;

  if (variant === "mobile") {
    return (
      <Link
        href={item.href}
        className={cn(
          "inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
          isActive
            ? "border-secondary text-secondary"
            : "border-transparent text-muted hover:text-foreground"
        )}
      >
        {item.icon && <span className="shrink-0">{item.icon}</span>}
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-white text-secondary shadow-sm ring-1 ring-border"
          : "text-muted hover:bg-white/70 hover:text-foreground"
      )}
    >
      {item.icon && (
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            isActive ? "bg-secondary-light text-secondary" : "bg-white/80 text-muted"
          )}
        >
          {item.icon}
        </span>
      )}
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export function DashboardSidebar({ items, title }) {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-[260px] shrink-0 md:block">
        <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col border-r border-border bg-surface-muted px-3 py-5">
          <div className="mb-5 px-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Dashboard
            </p>
            <h2 className="mt-1 text-base font-semibold text-foreground">{title}</h2>
          </div>
          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} variant="desktop" />
            ))}
          </nav>
        </div>
      </aside>

      <nav className="border-b border-border bg-white md:hidden">
        <div className="flex gap-0 overflow-x-auto px-2 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} variant="mobile" />
          ))}
        </div>
      </nav>
    </>
  );
}
