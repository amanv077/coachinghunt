import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export function AuthHeader() {
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <Logo href="/" size="md" />
      <Link
        href="/"
        className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-secondary-light hover:text-secondary"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
