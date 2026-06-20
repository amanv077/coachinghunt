import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-secondary/10 bg-white">
      <div className="navy-gradient px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <h3 className="text-xl font-bold text-white">CoachingHunt</h3>
            <p className="mt-1 max-w-md text-sm text-white/75">
              Discover, compare, and book demo sessions with top offline coaching institutes across India.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/signup"
              className="min-h-11 rounded-lg bg-white px-5 py-2.5 text-center text-sm font-semibold text-secondary transition hover:bg-secondary-light"
            >
              Student Signup
            </Link>
            <Link
              href="/signup/coaching"
              className="min-h-11 rounded-lg border border-white/30 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
            >
              List Coaching
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4 sm:px-6">
        <div>
          <h4 className="font-semibold text-secondary">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/search" className="hover:text-secondary">Search Coachings</Link></li>
            <li><Link href="/exams" className="hover:text-secondary">Browse by Exam</Link></li>
            <li><Link href="/blog" className="hover:text-secondary">Blog</Link></li>
            <li><Link href="/success-stories" className="hover:text-secondary">Success Stories</Link></li>
            <li><Link href="/about" className="hover:text-secondary">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-secondary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-secondary">For Institutes</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/signup/coaching" className="hover:text-secondary">List Your Coaching</Link></li>
            <li><Link href="/login" className="hover:text-secondary">Coaching Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-secondary">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/privacy" className="hover:text-secondary">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-secondary">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-secondary">Get started</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/signup" className="hover:text-secondary">Student Signup</Link></li>
            <li><Link href="/login" className="hover:text-secondary">Login</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-sm text-muted">
        © {new Date().getFullYear()} CoachingHunt. All rights reserved.
      </div>
    </footer>
  );
}
