import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { getWhatsAppHref } from "@/lib/marketing/contact";

export function Footer() {
  const whatsappHref = getWhatsAppHref();

  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="navy-gradient px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-md">
              <Logo href="/" size="md" variant="light" />
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                Find verified coaching institutes, compare batches, and book free demo sessions — all in one place.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                  Free for students
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                  Verified listings
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/search"
                className="min-h-11 rounded-xl bg-white px-5 py-2.5 text-center text-sm font-semibold text-secondary transition hover:bg-secondary-light"
              >
                Find Coachings
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 rounded-xl border border-white/30 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Chat on WhatsApp
              </a>
              <Link
                href="/signup/coaching"
                className="min-h-11 rounded-xl border border-white/30 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                List Your Coaching
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 md:grid-cols-4">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Explore</h4>
          <ul className="mt-3 space-y-2.5 text-sm text-muted">
            <li><Link href="/search" className="transition hover:text-secondary">Search Coachings</Link></li>
            <li><Link href="/exams" className="transition hover:text-secondary">Browse by Exam</Link></li>
            <li><Link href="/blog" className="transition hover:text-secondary">Blog</Link></li>
            <li><Link href="/success-stories" className="transition hover:text-secondary">Success Stories</Link></li>
            <li><Link href="/about" className="transition hover:text-secondary">About Us</Link></li>
            <li><Link href="/contact" className="transition hover:text-secondary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">For Students</h4>
          <ul className="mt-3 space-y-2.5 text-sm text-muted">
            <li><Link href="/signup" className="transition hover:text-secondary">Create Account</Link></li>
            <li><Link href="/student/saved" className="transition hover:text-secondary">Saved &amp; Compare</Link></li>
            <li><Link href="/login" className="transition hover:text-secondary">Student Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">For Institutes</h4>
          <ul className="mt-3 space-y-2.5 text-sm text-muted">
            <li><Link href="/signup/coaching" className="transition hover:text-secondary">List Your Coaching</Link></li>
            <li><Link href="/login" className="transition hover:text-secondary">Coaching Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Legal &amp; support</h4>
          <ul className="mt-3 space-y-2.5 text-sm text-muted">
            <li><Link href="/privacy" className="transition hover:text-secondary">Privacy Policy</Link></li>
            <li><Link href="/terms" className="transition hover:text-secondary">Terms of Service</Link></li>
            <li>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="transition hover:text-secondary">
                WhatsApp support
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center text-sm text-muted sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} CoachingHunt. All rights reserved.</p>
          <p>Made for students finding the right coaching.</p>
        </div>
      </div>
    </footer>
  );
}
