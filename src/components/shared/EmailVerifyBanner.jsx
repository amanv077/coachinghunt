"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function EmailVerifyBanner() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!session?.user || session.user.emailVerifiedAt) return null;

  async function resend() {
    setLoading(true);
    const res = await fetch("/api/auth/resend-verification", { method: "POST" });
    setLoading(false);
    if (res.ok) {
      setSent(true);
      await update();
    }
  }

  return (
    <div className="rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm">
      <p className="font-medium text-foreground">Verify your email</p>
      <p className="mt-1 text-muted">
        {sent
          ? "Verification email sent. Check your inbox."
          : "Confirm your email to secure your account and get booking updates."}
      </p>
      {!sent && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="mt-3 min-h-9"
          loading={loading}
          onClick={resend}
        >
          Resend verification email
        </Button>
      )}
    </div>
  );
}
