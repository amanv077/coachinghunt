"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function AdminReviewsPage() {
  const { addToast } = useToast();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/api/reviews?status=PENDING").then((r) => r.json()).then((d) => d.success && setReviews(d.data));
  }, []);

  async function moderate(id, status) {
    const res = await fetch(`/api/reviews/${id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      setReviews(reviews.filter((r) => r.id !== id));
      addToast(`Review ${status.toLowerCase()}`, "success");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Review Moderation</h1>
      <div className="mt-6 space-y-3">
        {reviews.length === 0 ? (
          <Card><p className="text-muted">No pending reviews.</p></Card>
        ) : (
          reviews.map((r) => (
            <Card key={r.id}>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{r.student?.user?.name} · ★ {r.rating}</p>
                  {r.comment && <p className="mt-1 text-sm text-muted">{r.comment}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => moderate(r.id, "APPROVED")}>Approve</Button>
                  <Button size="sm" variant="danger" onClick={() => moderate(r.id, "REJECTED")}>Reject</Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
