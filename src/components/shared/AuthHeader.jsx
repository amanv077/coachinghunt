import Link from "next/link";

export function AuthHeader() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-secondary">
        CoachingHunt
      </Link>
      <Link
        href="/"
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-secondary-light hover:text-secondary"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
