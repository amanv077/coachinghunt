"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function CancelDemoRequestButton({ requestId }) {
  const router = useRouter();

  async function handleCancel() {
    if (!confirm("Cancel this demo request?")) return;
    const res = await fetch(`/api/demo-requests/${requestId}/cancel`, { method: "PATCH" });
    const data = await res.json();
    if (data.success) {
      router.refresh();
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-danger hover:bg-red-50"
      onClick={handleCancel}
    >
      Cancel request
    </Button>
  );
}
