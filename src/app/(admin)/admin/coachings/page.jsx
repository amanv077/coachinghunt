"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function AdminCoachingsPage() {
  const { addToast } = useToast();
  const [coachings, setCoachings] = useState([]);

  useEffect(() => {
    fetch("/api/admin/coachings").then((r) => r.json()).then((d) => d.success && setCoachings(d.data.items));
  }, []);

  async function verify(id, status) {
    const res = await fetch(`/api/admin/coachings/${id}/verify`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verificationStatus: status }),
    });
    const data = await res.json();
    if (data.success) {
      setCoachings(coachings.map((c) => (c.id === id ? { ...c, verificationStatus: status } : c)));
      addToast(`Coaching ${status.toLowerCase()}`, "success");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Coachings</h1>
      <div className="mt-6 space-y-3">
        {coachings.map((c) => (
          <Card key={c.id} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-muted">{c.city} · {c.user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={c.verificationStatus === "VERIFIED" ? "success" : "warning"}>{c.verificationStatus}</Badge>
              <Badge>{c.listingStatus}</Badge>
              {c.verificationStatus !== "VERIFIED" && (
                <Button size="sm" onClick={() => verify(c.id, "VERIFIED")}>Verify</Button>
              )}
              {c.verificationStatus !== "REJECTED" && (
                <Button size="sm" variant="danger" onClick={() => verify(c.id, "REJECTED")}>Reject</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
