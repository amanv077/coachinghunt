import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold">You are offline</h1>
      <p className="mt-2 text-muted">
        CoachingHunt needs an internet connection to search coachings and book demos.
      </p>
      <Link href="/" className="mt-6 text-secondary font-medium hover:underline">
        Try again
      </Link>
    </main>
  );
}
