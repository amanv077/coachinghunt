"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";

export function QASection({ coachingId, isLoggedIn, isStudent }) {
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/coaching-qa?coachingId=${coachingId}`)
      .then((r) => r.json())
      .then((d) => d.success && setItems(d.data));
  }, [coachingId]);

  async function handleAsk(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/coaching-qa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coachingId, question }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setQuestion("");
      addToast("Question submitted. The coaching will answer soon.", "success");
    } else {
      addToast(data.message || "Could not submit question", "error");
    }
  }

  return (
    <section className="space-y-4">
      {isStudent && (
        <Card className="!p-4">
          <h3 className="font-semibold text-foreground">Ask a question</h3>
          <form onSubmit={handleAsk} className="mt-3 space-y-3">
            <Textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about fees, batches, faculty, or demo timings..."
              required
            />
            <Button type="submit" loading={loading} className="min-h-11 w-full sm:w-auto">
              Submit question
            </Button>
          </form>
        </Card>
      )}

      {!isLoggedIn && (
        <Card className="!p-4 text-sm text-muted">
          Sign in as a student to ask this coaching a question publicly.
        </Card>
      )}

      {items.length === 0 ? (
        <Card className="text-center !p-6">
          <p className="text-sm text-muted">No questions answered yet. Be the first to ask.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="!p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-foreground">Q: {item.question}</p>
                {isLoggedIn && (
                  <ReportContentButton qaId={item.id} coachingId={coachingId} />
                )}
              </div>
              {item.answer && (
                <p className="mt-2 text-sm leading-relaxed text-muted">A: {item.answer}</p>
              )}
              <p className="mt-2 text-xs text-muted">
                {item.askedBy?.name || "Student"} · {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
