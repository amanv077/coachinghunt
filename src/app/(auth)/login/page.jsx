"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { AuthInput } from "@/components/shared/AuthInput";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { Logo } from "@/components/shared/Logo";
import {
  getLoginCallbackFromSearchParams,
  getPostLoginDestination,
  redirectAfterLogin,
} from "@/lib/auth/login";

// Vector Icons
const EmailIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

const LockIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

function LoginForm() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const callbackUrl = getLoginCallbackFromSearchParams(searchParams);
  const registered = searchParams.get("registered");
  const registeredBannerShown = useRef(false);
  const redirectStarted = useRef(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showRegisteredBanner, setShowRegisteredBanner] = useState(false);

  function completeLogin(role) {
    if (redirectStarted.current) return;
    redirectStarted.current = true;
    redirectAfterLogin(getPostLoginDestination(callbackUrl, role));
  }

  useEffect(() => {
    if (status !== "authenticated") return;
    completeLogin(session?.user?.role);
  }, [status, session, callbackUrl]);

  useEffect(() => {
    if (!registered || registeredBannerShown.current) return;
    registeredBannerShown.current = true;
    setShowRegisteredBanner(true);
  }, [registered]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setSubmitting(false);
        return;
      }

      if (!result?.ok) {
        setError("Could not sign in. Please try again.");
        setSubmitting(false);
        return;
      }

      completeLogin(null);
    } catch {
      setError("Could not sign in. Please try again.");
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return <LoginFallback message="Checking your session…" />;
  }

  if (status === "authenticated" && !submitting) {
    return <LoginRedirectState message="Opening your dashboard…" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Welcome back</h1>
          <p className="mt-1.5 text-sm text-muted">Sign in to manage your CoachingHunt account</p>
        </div>

        {showRegisteredBanner && (
          <div className="mt-2 mb-4 rounded-xl bg-indigo-50/50 border border-indigo-100 px-4 py-3 text-sm text-indigo-700 flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs">
              ✓
            </span>
            <span>
              {registered === "coaching"
                ? "Coaching account created. Sign in to finish setup."
                : "Account created successfully. Sign in to continue."}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <AuthInput
            label="Email"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            disabled={submitting}
            icon={EmailIcon}
          />
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground/90">Password</label>
              <Link href="/forgot-password" className="text-xs font-semibold text-secondary hover:text-secondary-hover transition-colors">
                Forgot password?
              </Link>
            </div>
            <AuthInput
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              disabled={submitting}
              icon={LockIcon}
              showPasswordToggle={true}
            />
          </div>

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

          <Button type="submit" className="min-h-12 w-full rounded-xl mt-2 font-semibold shadow-xs" loading={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 border-t border-border/80 pt-6 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/signup/student" className="font-semibold text-secondary hover:text-secondary-hover hover:underline transition-colors">
            Student signup
          </Link>{" "}
          or{" "}
          <Link href="/signup/coaching" className="font-semibold text-secondary hover:text-secondary-hover hover:underline transition-colors">
            Coaching signup
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}

function LoginRedirectState({ message }) {
  return (
    <Card className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex min-h-72 flex-col items-center justify-center gap-5 px-4 py-8 text-center">
        <Logo href={null} size="lg" />
        <Loader size="lg" label={message} />
        <div className="space-y-1 mt-2">
          <p className="text-base font-bold text-foreground">{message}</p>
          <p className="text-sm text-muted">This usually takes a moment.</p>
        </div>
      </div>
    </Card>
  );
}

function LoginFallback({ message = "Loading…" }) {
  return (
    <Card className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex min-h-72 flex-col items-center justify-center gap-5 px-4 py-8 text-center">
        <Logo href={null} size="lg" />
        <Loader size="lg" label={message} />
        <p className="text-sm text-muted mt-2">{message}</p>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

