"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { CityAutocomplete } from "@/components/shared/CityAutocomplete";
import { ExamMultiSelect } from "@/components/shared/ExamMultiSelect";

export default function CoachingProfilePage() {
  const { addToast } = useToast();
  const [profileId, setProfileId] = useState("");
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    city: "",
    locality: "",
    category: "",
    phone: "",
    targetExams: [],
    subjects: "",
    listingStatus: "DRAFT",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/coachings/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setProfileId(d.data.id);
          setForm({
            name: d.data.name || "",
            tagline: d.data.tagline || "",
            description: d.data.description || "",
            city: d.data.city || "",
            locality: d.data.locality || "",
            category: d.data.category || "",
            phone: d.data.phone || "",
            targetExams: d.data.targetExams || [],
            subjects: d.data.subjects?.join(", ") || "",
            listingStatus: d.data.listingStatus || "DRAFT",
          });
        }
      });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/coachings/${profileId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        city: form.city,
        locality: form.locality,
        category: form.category,
        phone: form.phone,
        targetExams: form.targetExams,
        subjects: form.subjects.split(",").map((s) => s.trim()).filter(Boolean),
        listingStatus: form.listingStatus,
      }),
    });
    const data = await res.json();
    setLoading(false);
    addToast(data.success ? "Profile saved" : data.message, data.success ? "success" : "error");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Coaching Profile</h1>
      <Card className="mt-6 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Institute Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          <Textarea label="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <CityAutocomplete
              label="City"
              value={form.city}
              onChange={(city) => setForm({ ...form, city })}
            />
            <Input label="Locality" value={form.locality} onChange={(e) => setForm({ ...form, locality: e.target.value })} />
          </div>
          <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <ExamMultiSelect
            label="Target exams"
            value={form.targetExams}
            onChange={(targetExams) => setForm({ ...form, targetExams })}
          />
          <Input label="Subjects (comma separated)" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} />
          <Button type="submit" loading={loading} className="min-h-11 w-full md:w-auto">Save Profile</Button>
        </form>
      </Card>
    </div>
  );
}
