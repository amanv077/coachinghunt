"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function ProfileNudgeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-secondary/20 bg-secondary-light p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-secondary">Complete your profile</p>
        <p className="mt-1 text-sm text-muted">
          Add your city and exam interests to get personalised coaching suggestions.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <Link href="/student/complete-profile" className="w-full sm:w-auto">
          <Button className="w-full min-h-11 sm:w-auto">Complete profile</Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full min-h-11 sm:w-auto"
          onClick={() => setDismissed(true)}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}
