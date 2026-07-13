"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function MarkNoShowButton({ bookingId, onUpdated }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleMarkNoShow() {
    if (!confirm("Mark this student as no-show for the demo?")) return;
    setLoading(true);
    const res = await fetch(`/api/bookings/${bookingId}/no-show`, { method: "PATCH" });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      addToast("Marked as no-show", "success");
      onUpdated?.(data.data);
    } else {
      addToast(data.message || "Failed to update", "error");
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="min-h-9"
      loading={loading}
      onClick={handleMarkNoShow}
    >
      Mark no-show
    </Button>
  );
}
