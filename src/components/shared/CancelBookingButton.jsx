"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function CancelBookingButton({ bookingId }) {
  const router = useRouter();

  async function handleCancel() {
    if (!confirm("Cancel this booking?")) return;
    await fetch(`/api/bookings/${bookingId}/cancel`, { method: "PATCH" });
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" className="text-danger hover:bg-red-50" onClick={handleCancel}>
      Cancel
    </Button>
  );
}
