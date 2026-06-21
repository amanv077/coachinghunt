"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/shared/Logo";
import { NavbarSearch } from "@/components/shared/NavbarSearch";
import {
  getPublicNavLinks,
  getQuickAction,
  isNavLinkActive,
  variantMeta,
} from "@/components/shared/nav-config";
import { getDashboardPath, getProfilePath } from "@/lib/auth/dashboard";
import { cn } from "@/lib/utils/cn";

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function ProfileIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function SignOutIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
      />
    </svg>
  );
}

function MenuIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function AuthNavSkeleton() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      <span className="hidden h-9 w-16 animate-pulse rounded-lg bg-surface-muted sm:block" />
      <span className="h-9 w-9 animate-pulse rounded-full bg-surface-muted" />
    </div>
  );
}

function GuestAuthActions({ className }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Link href="/login">
        <Button variant="ghost" size="sm">
          Login
        </Button>
      </Link>
      <Link href="/signup">
        <Button size="sm">Sign Up</Button>
      </Link>
    </div>
  );
}

function NavLink({ href, label, pathname, icon, onNavigate }) {
  const active = isNavLinkActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-secondary-light text-secondary"
          : "text-foreground hover:bg-surface-muted hover:text-secondary"
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            active ? "bg-white text-secondary shadow-sm" : "bg-surface-muted text-muted"
          )}
        >
          {icon}
        </span>
      )}
      <span>{label}</span>
    </Link>
  );
}

function RoleBadge({ label, show, className }) {
  if (!label || !show) return null;

  return (
    <span
      className={cn(
        "hidden rounded-full bg-secondary-light px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary sm:inline-flex",
        className
      )}
    >
      {label}
    </span>
  );
}

function ProfileMenu({ session, onNavigate }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const role = session.user?.role;
  const profilePath = getProfilePath(role);
  const dashboardPath = getDashboardPath(role);
  const name = session.user?.name ?? "Account";
  const email = session.user?.email;
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
    onNavigate?.();
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className={cn(
          "flex min-h-11 items-center gap-2 rounded-full border border-border bg-white pl-1 pr-2.5 text-secondary transition",
          "hover:border-secondary/30 hover:bg-secondary-light/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
          open && "border-secondary/30 bg-secondary-light/50 ring-2 ring-secondary/20"
        )}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
          {initials || <ProfileIcon className="h-4 w-4" />}
        </span>
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-foreground lg:block">
          {name}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account options"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[120] w-60 overflow-hidden rounded-2xl border border-border bg-white py-1 shadow-lg"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-semibold text-foreground">{name}</p>
            {email && <p className="truncate text-xs text-muted">{email}</p>}
          </div>

          {dashboardPath && (
            <Link
              href={dashboardPath}
              role="menuitem"
              className="flex min-h-11 items-center gap-3 px-4 text-sm font-medium text-foreground transition hover:bg-secondary-light hover:text-secondary"
              onClick={close}
            >
              Dashboard
            </Link>
          )}

          {profilePath && (
            <Link
              href={profilePath}
              role="menuitem"
              className="flex min-h-11 items-center gap-3 px-4 text-sm font-medium text-foreground transition hover:bg-secondary-light hover:text-secondary"
              onClick={close}
            >
              <ProfileIcon className="h-5 w-5 shrink-0" />
              Profile
            </Link>
          )}

          <button
            type="button"
            role="menuitem"
            className="flex min-h-11 w-full items-center gap-3 px-4 text-left text-sm font-medium text-foreground transition hover:bg-secondary-light hover:text-secondary"
            onClick={() => {
              close();
              signOut({ callbackUrl: "/" });
            }}
          >
            <SignOutIcon className="h-5 w-5 shrink-0" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function MobileDrawer({ open, onClose, title, children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[1px] md:hidden"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="fixed inset-y-0 right-0 z-[101] flex w-[min(100vw,20rem)] flex-col bg-white shadow-2xl md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <button
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-muted transition hover:bg-surface-muted hover:text-foreground"
            aria-label="Close menu"
            onClick={onClose}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">{children}</div>
      </div>
    </>,
    document.body
  );
}

export function Navbar({ variant = "public", sidebarItems = [], hideLogoOnDesktop = false }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = session?.user?.role;
  const isDashboard = variant !== "public";
  const meta = variantMeta[variant] ?? variantMeta.public;
  const homeHref = isDashboard ? meta.homePath : getDashboardPath(role) ?? "/";
  const navLinks = isDashboard ? sidebarItems : getPublicNavLinks(role);
  const quickAction = getQuickAction(isDashboard ? variant : "public", role);
  const showDesktopNav = !isDashboard;
  const showMobileMenuButton = !isDashboard || sidebarItems.length > 0;
  const isSearchPage = pathname === "/search" || pathname.startsWith("/search/");
  const showSearchBar = !isSearchPage && (variant === "student" || !isDashboard);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/80 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6">
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            <Logo
              href={homeHref}
              size="md"
              className={cn(hideLogoOnDesktop && "md:hidden")}
            />
            <RoleBadge
              label={meta.label}
              show={meta.showBadge}
              className={cn(hideLogoOnDesktop && "md:inline-flex")}
            />
          </div>

          {showSearchBar && (
            <div
              className={cn(
                "min-w-0 flex-1 px-2 md:max-w-md lg:max-w-lg",
                variant === "student" ? "block" : "hidden md:block"
              )}
            >
              <Suspense fallback={<div className="h-11 rounded-xl bg-surface-muted" />}>
                <NavbarSearch />
              </Suspense>
            </div>
          )}

          {showDesktopNav && (
            <nav className="hidden shrink-0 items-center gap-0.5 lg:flex" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isNavLinkActive(pathname, link.href)
                      ? "bg-secondary-light text-secondary"
                      : "text-muted hover:bg-surface-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            {role === "STUDENT" && !isDashboard && (
              <Link
                href="/student/dashboard"
                className={cn(
                  "hidden min-h-11 items-center rounded-lg px-3 text-sm font-medium transition md:inline-flex lg:hidden",
                  isNavLinkActive(pathname, "/student/dashboard")
                    ? "bg-secondary-light text-secondary"
                    : "text-muted hover:bg-surface-muted hover:text-foreground"
                )}
              >
                Dashboard
              </Link>
            )}

            {quickAction && (
              <Link href={quickAction.href} className="hidden sm:block">
                <Button size="sm" variant={isDashboard ? "primary" : "secondary"}>
                  {quickAction.label}
                </Button>
              </Link>
            )}

            {status === "loading" ? (
              <AuthNavSkeleton />
            ) : session ? (
              <ProfileMenu session={session} />
            ) : (
              <GuestAuthActions className="hidden sm:flex" />
            )}

            {showMobileMenuButton && (
              <button
                type="button"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-secondary transition hover:bg-surface-muted md:hidden"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
      </header>

      <MobileDrawer
        open={menuOpen}
        onClose={closeMenu}
        title={isDashboard ? `${meta.label ?? "Dashboard"} menu` : "Menu"}
      >
        {showSearchBar && !isDashboard && (
          <div className="mb-4">
            <Suspense fallback={<div className="h-11 rounded-xl bg-surface-muted" />}>
              <NavbarSearch onSearch={closeMenu} />
            </Suspense>
          </div>
        )}

        <nav className="space-y-1" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
              pathname={pathname}
              onNavigate={closeMenu}
            />
          ))}
        </nav>

        {quickAction && (
          <div className="mt-4 border-t border-border pt-4">
            <Link href={quickAction.href} onClick={closeMenu} className="block">
              <Button className="min-h-11 w-full" variant={isDashboard ? "primary" : "secondary"}>
                {quickAction.label}
              </Button>
            </Link>
          </div>
        )}

        {status === "loading" ? (
          <div className="mt-4 border-t border-border pt-4">
            <div className="h-11 animate-pulse rounded-lg bg-surface-muted" />
          </div>
        ) : !session && !isDashboard ? (
          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <Link href="/login" onClick={closeMenu} className="block">
              <Button variant="ghost" className="min-h-11 w-full">
                Login
              </Button>
            </Link>
            <Link href="/signup" onClick={closeMenu} className="block">
              <Button className="min-h-11 w-full">Sign Up free</Button>
            </Link>
          </div>
        ) : null}

        {isDashboard && (
          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <Link
              href="/search"
              onClick={closeMenu}
              className="flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-secondary"
            >
              <SearchIcon className="h-5 w-5" />
              Browse coachings
            </Link>
            {role === "STUDENT" && (
              <>
                <Link
                  href="/student/saved"
                  onClick={closeMenu}
                  className="flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-secondary"
                >
                  Saved coachings
                </Link>
                <Link
                  href="/compare"
                  onClick={closeMenu}
                  className="flex min-h-11 items-center gap-3 rounded-xl border border-secondary/20 bg-secondary-light px-3.5 text-sm font-semibold text-secondary transition hover:bg-secondary hover:text-white"
                >
                  Compare coachings
                </Link>
              </>
            )}
          </div>
        )}
      </MobileDrawer>
    </>
  );
}
