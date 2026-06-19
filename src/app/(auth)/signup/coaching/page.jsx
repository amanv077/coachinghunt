"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { CityAutocomplete } from "@/components/shared/CityAutocomplete";
import { SignupRoleTabs } from "@/components/shared/SignupRoleTabs";
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
    <>
      <SignupRoleTabs active="coaching" />
      <Card className="shadow-md">
      <div className="border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
          Step 1 of 1 — Create your profile
        </p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">List your coaching</h1>
        <p className="mt-2 text-sm text-muted">Get discovered by students and receive demo bookings</p>
        <p className="mt-3 text-xs text-secondary">
          500+ institutes already listed on CoachingHunt
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-foreground">Institute details</legend>
          <Input
            label="Contact Person Name"
            value={form.contactPersonName}
            onChange={(e) => setForm({ ...form, contactPersonName: e.target.value })}
            required
          />
          <Input
            label="Coaching Name"
            value={form.coachingName}
            onChange={(e) => setForm({ ...form, coachingName: e.target.value })}
            required
          />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-foreground">Account & contact</legend>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-foreground">Location</legend>
          <CityAutocomplete
            label="City"
            value={form.city}
            onChange={(city) => setForm({ ...form, city })}
            required
          />
          <Input
            label="Locality"
            value={form.locality}
            onChange={(e) => setForm({ ...form, locality: e.target.value })}
            required
          />
        </fieldset>

        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        )}
        <Button type="submit" className="min-h-11 w-full" loading={loading}>
          Create Coaching Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-secondary hover:underline">
          Login
        </Link>
      </p>
    </Card>
    </>
  );
}
