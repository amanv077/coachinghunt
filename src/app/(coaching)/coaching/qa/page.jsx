"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function CoachingQAPage() {
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loadingId, setLoadingId] = useState("");

  function loadInbox() {
    return fetch("/api/coaching-qa/inbox")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setItems(d.data.filter((q) => q.status === "PENDING"));
      });
  }

  useEffect(() => {
    loadInbox();
  }, []);

  async function submitAnswer(id) {
    setLoadingId(id);
    const res = await fetch(`/api/coaching-qa/${id}/answer`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: answers[id] }),
    });
    const data = await res.json();
    setLoadingId("");
    if (data.success) {
      addToast("Answer posted", "success");
      loadInbox();
    } else {
      addToast(data.message, "error");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Q&A Inbox</h1>
      <p className="mt-1 text-sm text-muted">Answer student questions to build trust publicly.</p>
      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <Card><p className="text-muted">No pending questions.</p></Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="space-y-3">
              <p className="font-medium">{item.question}</p>
              <p className="text-xs text-muted">{item.askedBy?.name || "Student"}</p>
              <Textarea
                rows={3}
                value={answers[item.id] || ""}
                onChange={(e) => setAnswers({ ...answers, [item.id]: e.target.value })}
                placeholder="Write your answer..."
              />
              <Button
                className="min-h-11 w-full sm:w-auto"
                loading={loadingId === item.id}
                onClick={() => submitAnswer(item.id)}
              >
                Post answer
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
