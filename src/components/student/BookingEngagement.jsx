"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function BookingSuccessBanner() {
  return (
    <Card className="border-success/30 bg-success/5 p-4">
      <p className="font-semibold text-foreground">Demo booked successfully!</p>
      <p className="mt-1 text-sm text-muted">
        Check your email for confirmation. You can manage bookings below.
      </p>
    </Card>
  );
}

export function ReviewNudgeCard({ coachingSlug, coachingName }) {
  return (
    <Card className="border-secondary/20 bg-secondary-light/20 p-4">
      <p className="font-medium">How was your demo at {coachingName}?</p>
      <p className="mt-1 text-sm text-muted">
        Share a verified review to help other students choose wisely.
      </p>
      <Link href={`/coaching/${coachingSlug}#reviews`} className="mt-3 inline-block w-full sm:w-auto">
        <Button size="sm" className="w-full min-h-11 sm:w-auto">
          Leave a review
        </Button>
      </Link>
    </Card>
  );
}
