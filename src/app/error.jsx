"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <Card className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Error</p>
        <h1 className="mt-3 text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted">
          We hit an unexpected problem. Please try again or return to the homepage.
        </p>
        {error?.digest && (
          <p className="mt-2 text-xs text-muted">Reference: {error.digest}</p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button type="button" onClick={() => reset()} className="min-h-11 w-full sm:w-auto">
            Try again
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="secondary" className="min-h-11 w-full">
              Go home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
