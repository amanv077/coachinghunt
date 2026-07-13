"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { AuthInput } from "@/components/shared/AuthInput";
import { Button } from "@/components/ui/Button";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setDone(true);
    } else {
      setError(data.message || "Reset failed");
    }
  }

  if (!token || !email) {
    return (
      <Card className="rounded-2xl p-6 sm:p-8">
        <p className="text-sm text-danger">Invalid reset link.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-sm font-semibold text-secondary">
          Request a new link
        </Link>
      </Card>
    );
  }

  if (done) {
    return (
      <Card className="rounded-2xl p-6 sm:p-8 text-center">
        <p className="font-semibold text-foreground">Password updated</p>
        <Link href="/login" className="mt-4 inline-block">
          <Button className="min-h-11 w-full">Sign in</Button>
        </Link>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Set new password</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <AuthInput
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            showPasswordToggle
          />
          <AuthInput
            label="Confirm password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            showPasswordToggle
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" loading={loading} className="min-h-12 w-full">
            Update password
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Card className="p-8">Loading…</Card>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
