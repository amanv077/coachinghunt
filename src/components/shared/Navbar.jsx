"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { getDashboardPath, getProfilePath } from "@/lib/auth/dashboard";
import { cn } from "@/lib/utils/cn";

const guestLinks = [
  { href: "/search", label: "Find Coachings" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const studentLinks = [
  { href: "/search", label: "Find Coachings" },
  { href: "/student/bookings", label: "My Bookings" },
  { href: "/student/offers", label: "My Offers" },
];

const coachingLinks = [
  { href: "/coaching/dashboard", label: "Dashboard" },
  { href: "/coaching/courses", label: "Courses" },
  { href: "/coaching/demo-slots", label: "Demo Slots" },
  { href: "/coaching/bookings", label: "Bookings" },
];

const adminLinks = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/coachings", label: "Coachings" },
  { href: "/admin/bookings", label: "Bookings" },
];

function getNavLinks(role) {
  if (role === "STUDENT") return studentLinks;
  if (role === "COACHING") return coachingLinks;
  if (role === "ADMIN") return adminLinks;
  return guestLinks;
}

function isLinkActive(pathname, href) {
  if (href === "/coaching/dashboard" || href === "/admin/dashboard") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
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

function ProfileMenu({ session }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const role = session.user?.role;
  const profilePath = getProfilePath(role);
  const dashboardPath = role === "ADMIN" ? getDashboardPath(role) : null;
  const name = session.user?.name ?? "Account";
  const email = session.user?.email;

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

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className={cn(
          "flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-secondary-light text-secondary transition",
          "hover:bg-secondary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
          open && "bg-secondary/10 ring-2 ring-secondary/20"
        )}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <ProfileIcon className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account options"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg"
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
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {profilePath && (
            <Link
              href={profilePath}
              role="menuitem"
              className="flex min-h-11 items-center gap-3 px-4 text-sm font-medium text-foreground transition hover:bg-secondary-light hover:text-secondary"
              onClick={() => setOpen(false)}
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
              setOpen(false);
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

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = session?.user?.role;
  const navLinks = getNavLinks(role);
  const homeHref = getDashboardPath(role) ?? "/";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-secondary/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        <Link href={homeHref} className="shrink-0 text-xl font-bold text-secondary">
          CoachingHunt
        </Link>

        <nav className="hidden items-center justify-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium transition hover:bg-secondary-light hover:text-secondary",
                isLinkActive(pathname, link.href) ? "bg-secondary-light text-secondary" : "text-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {session ? (
            <ProfileMenu session={session} />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

          <button
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-secondary md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 top-[57px] z-40 bg-black/30 md:hidden"
            aria-hidden
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full z-50 border-b border-secondary/10 bg-white shadow-lg md:hidden">
            <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block min-h-11 rounded-lg px-4 py-3 text-base font-medium transition",
                      isLinkActive(pathname, link.href)
                        ? "bg-secondary-light text-secondary"
                        : "text-foreground hover:bg-secondary-light hover:text-secondary"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {!session && (
                <div className="mt-4 space-y-2 border-t border-border pt-4">
                  <Link href="/login" className="block">
                    <Button variant="ghost" className="min-h-11 w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" className="block">
                    <Button className="min-h-11 w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
