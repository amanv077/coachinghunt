"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function RequestReviewButton({ bookingId, sentAt }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(!!sentAt);

  async function handleSend() {
    setLoading(true);
    const res = await fetch(`/api/bookings/${bookingId}/request-review`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setSent(true);
      addToast("Review invite sent to student", "success");
    } else {
      addToast(data.message || "Failed to send invite", "error");
    }
  }

  if (sent) {
    return <span className="text-xs text-muted">Review invite sent</span>;
  }

  return (
    <Button type="button" size="sm" variant="secondary" className="min-h-9" loading={loading} onClick={handleSend}>
      Request review
    </Button>
  );
}
