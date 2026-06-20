"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  getLoginCallbackFromSearchParams,
  getPostLoginDestination,
} from "@/lib/auth/login";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status, update } = useSession();
  const { addToast } = useToast();
  const callbackUrl = getLoginCallbackFromSearchParams(searchParams);
  const registered = searchParams.get("registered");
  const registeredToastShown = useRef(false);
  const redirectStarted = useRef(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || redirectStarted.current) return;
    redirectStarted.current = true;
    const destination = getPostLoginDestination(callbackUrl, session.user?.role);
    router.replace(destination);
  }, [status, session, callbackUrl, router]);

  useEffect(() => {
    if (!registered || registeredToastShown.current) return;
    registeredToastShown.current = true;

    if (registered === "student") {
      addToast("Account created! Sign in to continue.", "success");
      return;
    }

    if (registered === "coaching") {
      addToast("Coaching account created! Sign in to finish setup.", "success");
    }
  }, [registered, addToast]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      if (!result?.ok) {
        setError("Could not sign in. Please try again.");
        return;
      }

      const session = await update();
      const destination = getPostLoginDestination(callbackUrl, session?.user?.role);

      addToast("Welcome back! You're signed in.", "success");
      router.refresh();
      router.push(destination);
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || status === "authenticated") {
    return <LoginFallback />;
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

function LoginFallback() {
  return (
    <Card className="shadow-md">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Sign in to your CoachingHunt account</p>
      </div>
      <div className="mt-6 h-48 flex items-center justify-center text-sm text-muted">
        Loading…
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
