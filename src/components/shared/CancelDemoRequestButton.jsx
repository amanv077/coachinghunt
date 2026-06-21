"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function CancelDemoRequestButton({ requestId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    if (!confirm("Cancel this demo request?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/demo-requests/${requestId}/cancel`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      }
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
      Cancel request
    </Button>
  );
}
