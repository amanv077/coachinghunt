"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function StudentSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    targetExam: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup/student", {
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

    router.push("/login?registered=student");
  }

  return (
    <Card className="shadow-md">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Create student account</h1>
        <p className="mt-2 text-sm text-muted">Book demo sessions and track your coaching search</p>
        <p className="mt-3 text-xs text-secondary">
          Join 10,000+ students already discovering coachings on CoachingHunt
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-foreground">Personal info</legend>
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
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
          <legend className="text-sm font-semibold text-foreground">Your goals</legend>
          <Input
            label="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
          />
          <Input
            label="Target Exam"
            placeholder="JEE, NEET, Boards, etc."
            value={form.targetExam}
            onChange={(e) => setForm({ ...form, targetExam: e.target.value })}
            required
          />
        </fieldset>

        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        )}
        <Button type="submit" className="min-h-11 w-full" loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-secondary hover:underline">
          Login
        </Link>
      </p>
    </Card>
  );
}
