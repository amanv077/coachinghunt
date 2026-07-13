"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { AuthInput } from "@/components/shared/AuthInput";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setMessage(data.message);
    } else {
      setError(data.message || "Something went wrong");
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <p className="mt-1 text-sm text-muted">Enter your email and we will send a reset link.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <AuthInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {message && <p className="text-sm text-success">{message}</p>}
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" loading={loading} className="min-h-12 w-full">
            Send reset link
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          <Link href="/login" className="font-semibold text-secondary">Back to login</Link>
        </p>
      </Card>
    </motion.div>
  );
}
