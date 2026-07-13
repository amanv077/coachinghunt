"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

export function GetFeaturedCard() {
  const { addToast } = useToast();
  const [request, setRequest] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/featured-requests")
      .then((r) => r.json())
      .then((d) => d.success && setRequest(d.data))
      .finally(() => setFetching(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/featured-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: note.trim() || undefined }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setRequest(data.data);
      setNote("");
      addToast("Featured request submitted", "success");
    } else {
      addToast(data.message || "Could not submit request", "error");
    }
  }

  if (fetching) return null;

  const isPending = request?.status === "PENDING";

  return (
    <Card className="border-warning/20 bg-warning/5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Get Featured</h2>
          <p className="mt-1 text-sm text-muted">
            Boost visibility on search and homepage for 30 days after approval.
          </p>
        </div>
        {request && (
          <Badge variant={request.status === "APPROVED" ? "success" : request.status === "PENDING" ? "warning" : "default"}>
            {request.status}
          </Badge>
        )}
      </div>

      {isPending ? (
        <p className="mt-4 text-sm text-muted">
          Your request is under review. We will notify you once it is processed.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Textarea
            label="Why should you be featured? (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Share results, unique programs, or student success stories"
          />
          <Button type="submit" className="w-full min-h-11 sm:w-auto" loading={loading}>
            Request featured listing
          </Button>
        </form>
      )}
    </Card>
  );
}
