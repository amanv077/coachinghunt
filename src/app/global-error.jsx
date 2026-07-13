"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted">An unexpected error occurred. Please try again.</p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={reset} className="min-h-11 w-full sm:w-auto">Try again</Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="secondary" className="min-h-11 w-full">Go home</Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
