"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function CoachingSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    contactPersonName: "",
    coachingName: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    locality: "",
    category: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup/coaching", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError(data.message);
      return;
    }

    router.push("/login?registered=coaching");
  }

  return (
    <Card>
      <h1 className="text-2xl font-bold">Coaching Signup</h1>
      <p className="mt-1 text-sm text-muted">List your institute and get student leads</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input label="Contact Person Name" value={form.contactPersonName} onChange={(e) => setForm({ ...form, contactPersonName: e.target.value })} required />
        <Input label="Coaching Name" value={form.coachingName} onChange={(e) => setForm({ ...form, coachingName: e.target.value })} required />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        <Input label="Locality" value={form.locality} onChange={(e) => setForm({ ...form, locality: e.target.value })} required />
        <Input label="Category" placeholder="Engineering Entrance" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full" loading={loading}>Create Coaching Account</Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        Already have an account? <Link href="/login" className="text-primary">Login</Link>
      </p>
    </Card>
  );
}
