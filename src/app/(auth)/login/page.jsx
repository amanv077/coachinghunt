"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    const res = await fetch("/api/auth/session");
    const session = await res.json();
    const role = session?.user?.role;

    if (role === "STUDENT") router.push("/student/dashboard");
    else if (role === "COACHING") router.push("/coaching/dashboard");
    else if (role === "ADMIN") router.push("/admin/dashboard");
    else router.push("/");
  }

  return (
    <Card className="shadow-md">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Sign in to your CoachingHunt account</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Password</label>
            <Link href="/contact" className="text-xs font-medium text-secondary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        )}
        <Button type="submit" className="min-h-11 w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link href="/signup/student" className="font-semibold text-secondary hover:underline">
          Student signup
        </Link>{" "}
        or{" "}
        <Link href="/signup/coaching" className="font-semibold text-secondary hover:underline">
          Coaching signup
        </Link>
      </div>
    </Card>
  );
}
