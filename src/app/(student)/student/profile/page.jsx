"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function StudentProfilePage() {
  const { addToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/student/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setProfile(d.data);
          setForm({
            city: d.data.city || "",
            classLevel: d.data.classLevel || "",
            targetExam: d.data.targetExam || "",
            schoolName: d.data.schoolName || "",
          });
        }
      });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/student/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    addToast(data.success ? "Profile updated" : data.message, data.success ? "success" : "error");
  }

  if (!profile) return <p className="text-muted">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">My Profile</h1>
      <Card className="mt-6 max-w-lg">
        <p className="text-sm text-muted">{profile.user?.name} · {profile.user?.email}</p>
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <Input label="Class Level" value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: e.target.value })} />
          <Input label="Target Exam" value={form.targetExam} onChange={(e) => setForm({ ...form, targetExam: e.target.value })} />
          <Input label="School Name" value={form.schoolName} onChange={(e) => setForm({ ...form, schoolName: e.target.value })} />
          <Button type="submit" loading={loading}>Save Profile</Button>
        </form>
      </Card>
    </div>
  );
}
