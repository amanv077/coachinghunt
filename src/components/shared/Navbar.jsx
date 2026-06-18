"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/search", label: "Find Coachings" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardLink =
    session?.user?.role === "STUDENT"
      ? "/student/dashboard"
      : session?.user?.role === "COACHING"
        ? "/coaching/dashboard"
        : session?.user?.role === "ADMIN"
          ? "/admin/dashboard"
          : null;

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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="text-xl font-bold text-secondary">
          CoachingHunt
        </Link>

        <nav className="hidden items-center justify-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium transition hover:bg-secondary-light hover:text-secondary",
                pathname === link.href ? "bg-secondary-light text-secondary" : "text-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <>
              {dashboardLink && (
                <Link href={dashboardLink}>
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
              )}
              <Button variant="secondary" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup/student">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

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
                      pathname === link.href
                        ? "bg-secondary-light text-secondary"
                        : "text-foreground hover:bg-secondary-light hover:text-secondary"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-border pt-4">
                {session ? (
                  <>
                    {dashboardLink && (
                      <Link href={dashboardLink} className="block">
                        <Button variant="ghost" className="min-h-11 w-full">
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="secondary"
                      className="min-h-11 w-full"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block">
                      <Button variant="ghost" className="min-h-11 w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup/student" className="block">
                      <Button className="min-h-11 w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
