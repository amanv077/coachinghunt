"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { Logo } from "@/components/shared/Logo";
import {
  getLoginCallbackFromSearchParams,
  getPostLoginDestination,
  redirectAfterLogin,
} from "@/lib/auth/login";

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
    <Card className="shadow-md">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Sign in to your CoachingHunt account</p>
      </div>

      {showRegisteredBanner && (
        <p className="mt-6 rounded-lg bg-secondary/10 px-3 py-2 text-sm text-secondary">
          {registered === "coaching"
            ? "Coaching account created. Sign in to finish setup."
            : "Account created. Sign in to continue."}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          disabled={submitting}
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
            disabled={submitting}
          />
        </div>
        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        )}
        <Button type="submit" className="min-h-11 w-full" loading={submitting}>
          {submitting ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-secondary hover:underline">
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

function LoginRedirectState({ message }) {
  return (
    <Card className="shadow-md">
      <div className="flex min-h-72 flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <Logo href={null} size="md" />
        <Loader size="lg" label={message} />
        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">{message}</p>
          <p className="text-sm text-muted">This usually takes a moment.</p>
        </div>
      </div>
    </Card>
  );
}

function LoginFallback({ message = "Loading…" }) {
  return (
    <Card className="shadow-md">
      <div className="flex min-h-72 flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <Logo href={null} size="md" />
        <Loader size="lg" label={message} />
        <p className="text-sm text-muted">{message}</p>
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
