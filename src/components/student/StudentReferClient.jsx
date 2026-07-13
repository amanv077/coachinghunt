"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function StudentReferClient({ referralCode, referralCount }) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareLink = referralCode ? `${appUrl}/signup/student?ref=${referralCode}` : "";

  async function copyLink() {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      addToast("Referral link copied", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast("Could not copy link", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Refer & Earn</h1>
        <p className="mt-1 text-muted">
          Invite friends to CoachingHunt. Track referrals — rewards coming soon.
        </p>
      </div>

      <Card className="space-y-4 p-5">
        <div>
          <p className="text-sm text-muted">Your referral code</p>
          <p className="mt-1 text-2xl font-bold tracking-wide">{referralCode || "—"}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Shareable link</p>
          <p className="mt-1 break-all text-sm">{shareLink || "Complete your profile to get a code"}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" className="min-h-11 w-full sm:w-auto" onClick={copyLink} disabled={!shareLink}>
            {copied ? "Copied!" : "Copy link"}
          </Button>
        </div>
        <p className="text-sm text-muted">
          <strong>{referralCount}</strong> friend{referralCount === 1 ? "" : "s"} joined using your link
        </p>
      </Card>
    </div>
  );
}
