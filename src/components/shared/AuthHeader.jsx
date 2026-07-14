import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export function AuthHeader() {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 md:mb-8">
      <div className="hidden md:block">
        <Logo href="/" size="md" />
      </div>
      <div className="md:hidden" aria-hidden />
      <Link
        href="/"
        className="group inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-muted shadow-xs transition hover:border-secondary-muted hover:bg-secondary-light/40 hover:text-secondary"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
            clipRule="evenodd"
          />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}
