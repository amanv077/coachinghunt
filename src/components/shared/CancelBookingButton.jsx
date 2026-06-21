"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function CancelBookingButton({ bookingId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    if (!confirm("Cancel this booking?")) return;
    setLoading(true);
    try {
      await fetch(`/api/bookings/${bookingId}/cancel`, { method: "PATCH" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-danger hover:bg-red-50"
      loading={loading}
      onClick={handleCancel}
    >
      Cancel
    </Button>
  );
}
