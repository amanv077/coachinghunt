"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function CoachingOffersPage() {
  const { addToast } = useToast();
  const [offers, setOffers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", promoCode: "", validFrom: "", validTill: "" });

  useEffect(() => {
    fetch("/api/coachings/me").then((r) => r.json()).then((d) => {
      if (d.success) {
        fetch(`/api/offers?coachingId=${d.data.id}`).then((r) => r.json()).then((o) => o.success && setOffers(o.data));
      }
    });
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setOffers([data.data, ...offers]);
      setShowForm(false);
      addToast("Offer created", "success");
    } else {
      addToast(data.message, "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Offers</h1>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Create Offer"}</Button>
      </div>
      {showForm && (
        <Card className="mt-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Promo code (optional)" value={form.promoCode} onChange={(e) => setForm({ ...form, promoCode: e.target.value })} placeholder="SAVE500" />
          <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Valid From" type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} required />
              <Input label="Valid Till" type="date" value={form.validTill} onChange={(e) => setForm({ ...form, validTill: e.target.value })} required />
            </div>
            <Button type="submit" loading={loading}>Create Offer</Button>
          </form>
        </Card>
      )}
      <div className="mt-6 space-y-3">
        {offers.map((o) => (
          <Card key={o.id}>
            <p className="font-medium">{o.title}</p>
            {o.description && <p className="text-sm text-muted">{o.description}</p>}
            {o.promoCode && (
              <p className="mt-2 inline-block rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-secondary">
                Code: {o.promoCode}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
