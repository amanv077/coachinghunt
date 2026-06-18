"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { data: session } = useSession();

  const dashboardLink =
    session?.user?.role === "STUDENT"
      ? "/student/dashboard"
      : session?.user?.role === "COACHING"
        ? "/coaching/dashboard"
        : session?.user?.role === "ADMIN"
          ? "/admin/dashboard"
          : null;

  return (
    <header className="sticky top-0 z-50 border-b border-secondary/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="text-xl font-bold text-secondary">
          CoachingHunt
        </Link>

        <nav className="hidden items-center justify-center gap-1 md:flex">
          {[
            { href: "/search", label: "Find Coachings" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted transition hover:bg-secondary-light hover:text-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2">
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
      </div>
    </header>
  );
}
