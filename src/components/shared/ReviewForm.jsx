"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

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
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <Input label="Rating (1-5)" type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
        <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Textarea label="Comment" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
        <Button type="submit" loading={loading}>Submit Review</Button>
      </form>
    </Card>
  );
}
