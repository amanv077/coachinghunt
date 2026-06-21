"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { AuthInput } from "@/components/shared/AuthInput";
import { Button } from "@/components/ui/Button";
import { SignupRoleTabs } from "@/components/shared/SignupRoleTabs";

// Vector Icons
const UserIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

const PhoneIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LockIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <SignupRoleTabs active="student" />
      <Card className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Create student account</h1>
          <p className="mt-1.5 text-sm text-muted">Book free demo sessions & compare rating results</p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-secondary/5 px-2.5 py-1 text-xs font-semibold text-secondary">
            <span className="flex h-1.5 w-1.5 rounded-full bg-secondary" />
            10,000+ students trust CoachingHunt
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <AuthInput
            label="Full Name"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            disabled={loading}
            icon={UserIcon}
          />
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            disabled={loading}
            icon={EmailIcon}
          />
          <AuthInput
            label="Phone Number"
            type="tel"
            placeholder="9876543210"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            disabled={loading}
            icon={PhoneIcon}
          />
          <AuthInput
            label="Password"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            disabled={loading}
            icon={LockIcon}
            showPasswordToggle={true}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-danger/5 border border-danger/10 px-4 py-3 text-sm text-danger flex items-center gap-2"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger text-xs font-bold">
                !
              </span>
              <span>{error}</span>
            </motion.div>
          )}

          <Button type="submit" className="min-h-12 w-full rounded-xl mt-2 font-semibold shadow-xs" loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-secondary hover:text-secondary-hover hover:underline transition-colors">
            Login
          </Link>
        </p>
      </Card>
    </motion.div>
  );
}

