"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DashboardListSkeleton } from "@/components/ui/DashboardListSkeleton";
import { useToast } from "@/components/ui/Toast";

export default function AdminQAPage() {
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/admin/qa")
      .then((r) => r.json())
      .then((d) => d.success && setItems(d.data))
      .finally(() => setFetching(false));
  }, []);

  async function moderate(id, status) {
    const res = await fetch(`/api/coaching-qa/${id}/moderate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, isPublic: status !== "HIDDEN" }),
    });
    const data = await res.json();
    if (data.success) {
      setItems(items.filter((i) => i.id !== id));
      addToast("Q&A moderated", "success");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Q&A Moderation</h1>
      <div className="mt-6 space-y-3">
        {fetching ? (
          <DashboardListSkeleton count={8} />
        ) : items.length === 0 ? (
          <Card><p className="text-muted">No pending Q&A.</p></Card>
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <p className="font-medium">{item.coaching.name}</p>
              <p className="mt-2 text-sm text-muted">Q: {item.question}</p>
              {item.answer && <p className="mt-1 text-sm text-muted">A: {item.answer}</p>}
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => moderate(item.id, "ANSWERED")}>Approve</Button>
                <Button size="sm" variant="danger" onClick={() => moderate(item.id, "HIDDEN")}>Hide</Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
