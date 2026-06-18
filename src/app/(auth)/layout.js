import Link from "next/link";
import { AuthHeader } from "@/components/shared/AuthHeader";

const trustPoints = [
  "Search 500+ verified coaching institutes",
  "Book free demo sessions in minutes",
  "Compare courses, fees & ratings",
  "Trusted by 10,000+ students",
];

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Brand panel — desktop only */}
      <div className="navy-gradient relative hidden flex-col justify-between overflow-hidden p-10 md:flex md:w-1/2 lg:p-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative">
          <Link href="/" className="text-2xl font-bold text-white">
            CoachingHunt
          </Link>
          <h2 className="mt-10 text-3xl font-bold leading-tight text-white lg:text-4xl">
            Find the right coaching.
            <span className="mt-2 block text-white/85">Book a demo in minutes.</span>
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
            India&apos;s trusted marketplace for discovering offline coaching institutes and booking demo sessions.
          </p>
        </div>
        <ul className="relative mt-10 space-y-4">
          {trustPoints.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-white/90">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {point}
            </li>
          ))}
        </ul>
        <p className="relative mt-auto pt-10 text-xs text-white/50">
          © {new Date().getFullYear()} CoachingHunt
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col bg-surface-muted px-4 py-8 sm:px-6 sm:py-10 md:items-center md:justify-center">
        <div className="mx-auto w-full max-w-md md:max-w-lg">
          <AuthHeader />
          {children}
        </div>
      </div>
    </div>
  );
}
