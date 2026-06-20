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

  async function toggleFeature(id, isFeatured) {
    const res = await fetch(`/api/admin/coachings/${id}/feature`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isFeatured,
        featuredUntil: isFeatured ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setCoachings(coachings.map((c) => (c.id === id ? { ...c, isFeatured } : c)));
      addToast(isFeatured ? "Marked as featured" : "Removed from featured", "success");
    }
  }

  async function togglePremium(id, isPremium) {
    const res = await fetch(`/api/admin/coachings/${id}/feature`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPremium }),
    });
    const data = await res.json();
    if (data.success) {
      setCoachings(coachings.map((c) => (c.id === id ? { ...c, isPremium } : c)));
      addToast(isPremium ? "Premium enabled" : "Premium disabled", "success");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Coachings</h1>
      <div className="mt-6 space-y-3">
        {coachings.map((c) => (
          <Card key={c.id} className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-muted">{c.city} · {c.user.email}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant={c.verificationStatus === "VERIFIED" ? "success" : "warning"}>{c.verificationStatus}</Badge>
                <Badge>{c.listingStatus}</Badge>
                {c.isFeatured && <Badge variant="warning">Featured</Badge>}
                {c.isPremium && <Badge variant="primary">Premium</Badge>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {c.verificationStatus !== "VERIFIED" && (
                <Button size="sm" className="min-h-9" onClick={() => verify(c.id, "VERIFIED")}>Verify</Button>
              )}
              {c.verificationStatus !== "REJECTED" && (
                <Button size="sm" variant="danger" className="min-h-9" onClick={() => verify(c.id, "REJECTED")}>Reject</Button>
              )}
              <Button size="sm" variant="secondary" className="min-h-9" onClick={() => toggleFeature(c.id, !c.isFeatured)}>
                {c.isFeatured ? "Unfeature" : "Feature"}
              </Button>
              <Button size="sm" variant="secondary" className="min-h-9" onClick={() => togglePremium(c.id, !c.isPremium)}>
                {c.isPremium ? "Remove premium" : "Premium"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
