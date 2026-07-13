"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";

function StarPicker({ value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">Rating</p>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const star = i + 1;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="min-h-11 min-w-11 rounded-lg text-2xl transition hover:bg-surface-muted"
              aria-label={`Rate ${star} stars`}
            >
              <span className={cn(star <= value ? "text-warning" : "text-border")}>★</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ReviewForm({ coachingId }) {
  const { addToast } = useToast();
  const [form, setForm] = useState({ rating: 5, title: "", comment: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, coachingId, rating: Number(form.rating) }),
    });
    const data = await res.json();
    setLoading(false);
    addToast(data.success ? "Review submitted for moderation" : data.message, data.success ? "success" : "error");
    if (data.success) setForm({ rating: 5, title: "", comment: "" });
  }

  return (
    <Card>
      <h3 className="font-semibold">Write a Review</h3>
      <p className="mt-1 text-xs text-muted">Only students who booked a demo can leave a review.</p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <StarPicker value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
        <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Textarea label="Comment" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
        <Button type="submit" loading={loading} className="min-h-11 w-full md:w-auto">Submit Review</Button>
      </form>
    </Card>
  );
}
