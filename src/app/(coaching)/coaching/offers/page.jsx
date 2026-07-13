"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DashboardListSkeleton } from "@/components/ui/DashboardListSkeleton";
import { useToast } from "@/components/ui/Toast";

const emptyForm = { title: "", description: "", promoCode: "", validFrom: "", validTill: "" };

export default function CoachingOffersPage() {
  const { addToast } = useToast();
  const [offers, setOffers] = useState([]);
  const [coachingId, setCoachingId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetch("/api/coachings/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setCoachingId(d.data.id);
          return fetch(`/api/offers?coachingId=${d.data.id}&includeAll=true`)
            .then((r) => r.json())
            .then((o) => o.success && setOffers(o.data));
        }
      })
      .finally(() => setFetching(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(editingId ? `/api/offers/${editingId}` : "/api/offers", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      if (editingId) {
        setOffers(offers.map((o) => (o.id === editingId ? data.data : o)));
        setEditingId(null);
      } else {
        setOffers([data.data, ...offers]);
      }
      setShowForm(false);
      setForm(emptyForm);
      addToast(editingId ? "Offer updated" : "Offer created", "success");
    } else {
      addToast(data.message, "error");
    }
  }

  function startEdit(offer) {
    setEditingId(offer.id);
    setShowForm(true);
    setForm({
      title: offer.title,
      description: offer.description || "",
      promoCode: offer.promoCode || "",
      validFrom: offer.validFrom ? new Date(offer.validFrom).toISOString().slice(0, 10) : "",
      validTill: offer.validTill ? new Date(offer.validTill).toISOString().slice(0, 10) : "",
    });
  }

  async function deactivateOffer(id) {
    const res = await fetch(`/api/offers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "EXPIRED" }),
    });
    const data = await res.json();
    if (data.success) {
      setOffers(offers.map((o) => (o.id === id ? data.data : o)));
      addToast("Offer deactivated", "success");
    } else {
      addToast(data.message, "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Offers</h1>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}>
          {showForm ? "Cancel" : "Create Offer"}
        </Button>
      </div>
      {showForm && (
        <Card className="mt-6">
          <h2 className="mb-4 text-lg font-semibold">{editingId ? "Edit offer" : "Create offer"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input label="Promo code (optional)" value={form.promoCode} onChange={(e) => setForm({ ...form, promoCode: e.target.value })} placeholder="SAVE500" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Valid From" type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} required />
              <Input label="Valid Till" type="date" value={form.validTill} onChange={(e) => setForm({ ...form, validTill: e.target.value })} required />
            </div>
            <Button type="submit" loading={loading} className="min-h-11">
              {editingId ? "Save changes" : "Create Offer"}
            </Button>
          </form>
        </Card>
      )}
      <div className="mt-6 space-y-3">
        {fetching ? (
          <DashboardListSkeleton count={5} />
        ) : (
          offers.map((o) => (
            <Card key={o.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{o.title}</p>
                    <Badge variant={o.status === "ACTIVE" ? "success" : "default"}>{o.status}</Badge>
                  </div>
                  {o.description && <p className="text-sm text-muted">{o.description}</p>}
                  <p className="mt-1 text-xs text-muted">
                    {new Date(o.validFrom).toLocaleDateString()} – {new Date(o.validTill).toLocaleDateString()}
                  </p>
                  {o.promoCode && (
                    <p className="mt-2 inline-block rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-secondary">
                      Code: {o.promoCode}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" size="sm" className="min-h-10" onClick={() => startEdit(o)}>Edit</Button>
                  {o.status === "ACTIVE" && (
                    <Button type="button" variant="secondary" size="sm" className="min-h-10" onClick={() => deactivateOffer(o.id)}>Deactivate</Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
