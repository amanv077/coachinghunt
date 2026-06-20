"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function RescheduleBookingButton({ bookingId }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleReschedule() {
    if (!confirm("Request a new demo time? Your current booking will be cancelled.")) return;
    setLoading(true);
    const res = await fetch(`/api/bookings/${bookingId}/reschedule`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    addToast(
      data.success ? "Reschedule request sent to coaching" : data.message || "Failed",
      data.success ? "success" : "error"
    );
    if (data.success) window.location.reload();
  }

  return (
    <Button type="button" variant="secondary" size="sm" className="min-h-9" loading={loading} onClick={handleReschedule}>
      Reschedule
    </Button>
  );
}
