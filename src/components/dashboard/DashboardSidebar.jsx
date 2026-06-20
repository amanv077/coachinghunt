"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { isNavLinkActive, variantMeta } from "@/components/shared/nav-config";
import { cn } from "@/lib/utils/cn";

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}

function SidebarNavLink({ item, pathname }) {
  const isActive = isNavLinkActive(pathname, item.href.split("?")[0]);

  return (
    <Link
      href={item.href}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-secondary-light text-secondary"
          : "text-foreground hover:bg-surface-muted hover:text-secondary",
        item.highlight && !isActive && "bg-secondary-light/60 text-secondary ring-1 ring-secondary/15"
      )}
    >
      {item.icon && (
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            isActive || item.highlight ? "bg-white text-secondary shadow-sm" : "bg-surface-muted text-muted"
          )}
        >
          {item.icon}
        </span>
      )}
      <span className="truncate">{item.label}</span>
      {item.badge && (
        <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-white">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function MobileNavLink({ item, pathname }) {
  const isActive = isNavLinkActive(pathname, item.href.split("?")[0]);

  return (
    <Link
      href={item.href}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
        isActive
          ? "border-secondary text-secondary"
          : "border-transparent text-muted hover:text-foreground",
        item.highlight && !isActive && "text-secondary"
      )}
    >
      {item.icon && <span className="shrink-0">{item.icon}</span>}
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-white">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function DashboardSidebar({ items, title, variant, homeHref }) {
  const pathname = usePathname();
  const meta = variantMeta[variant] ?? variantMeta.student;

  return (
    <aside className="hidden w-[240px] shrink-0 flex-col border-r border-border/80 bg-white lg:w-[260px] md:flex">
      <div className="flex h-14 shrink-0 items-center border-b border-border/80 px-4">
        <Logo href={homeHref} size="md" />
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
        {meta.label && (
          <div className="mb-3 px-3">
            {meta.showBadge ? (
              <span className="inline-flex rounded-full bg-secondary-light px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary">
                {meta.label}
              </span>
            ) : (
              <p className="text-xs font-medium text-muted">{meta.label} dashboard</p>
            )}
          </div>
        )}

        <nav className="flex flex-col gap-0.5" aria-label={`${title} navigation`}>
          {items.map((item) => (
            <SidebarNavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>
      </div>

      <div className="shrink-0 border-t border-border/80 p-3">
        <Link
          href="/search"
          className="flex min-h-10 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-secondary"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
            <SearchIcon className="h-4 w-4" />
          </span>
          Browse coachings
        </Link>
      </div>
    </aside>
  );
}

export function DashboardMobileNav({ items, showMobileTabs = true }) {
  const pathname = usePathname();

  if (!showMobileTabs) return null;

  return (
    <nav className="border-b border-border/80 bg-white md:hidden" aria-label="Dashboard navigation">
      <div className="flex gap-0 overflow-x-auto px-2 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <MobileNavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </div>
    </nav>
  );
}
