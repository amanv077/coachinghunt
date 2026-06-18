"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function BookDemoButton({ demoSlotId, disabled }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleBook() {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ demoSlotId }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setMessage(`Booked! Code: ${data.data.bookingCode}`);
      router.refresh();
    } else {
      setMessage(data.message);
    }
  }

  return (
    <div>
      <Button size="sm" onClick={handleBook} loading={loading} disabled={disabled}>
        Book Demo
      </Button>
      {message && <p className="mt-1 text-xs text-muted">{message}</p>}
    </div>
  );
}
