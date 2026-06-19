"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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

    if (!data.success) {
      setLoading(false);
      setError(data.message);
      return;
    }

    const signInResult = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (signInResult?.error) {
      router.push("/login?registered=student&redirect=/student/complete-profile");
      return;
    }

    router.push("/student/complete-profile");
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

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
