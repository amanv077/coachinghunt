"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function BookDemoButton({ demoSlotId, disabled }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleBook() {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ demoSlotId }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      router.push("/student/bookings?booked=1");
    } else {
      alert(data.message || "Booking failed");
    }
  }

  return (
    <Button size="sm" onClick={handleBook} loading={loading} disabled={disabled} className="min-h-9">
      Book Demo
    </Button>
  );
}
