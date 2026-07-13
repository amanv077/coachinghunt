"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";

export function ReportContentButton({ reviewId, qaId, coachingId }) {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!reason.trim()) {
      addToast("Please describe the issue", "error");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/content-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewId,
        qaId,
        coachingId,
        reason: reason.trim(),
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      addToast("Report submitted. Our team will review it.", "success");
      setOpen(false);
      setReason("");
    } else {
      addToast(data.message || "Could not submit report", "error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-muted underline-offset-2 hover:text-foreground hover:underline"
      >
        Report
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close"
            onClick={() => !loading && setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-t-2xl border border-border bg-white p-5 shadow-xl sm:rounded-2xl">
            <h3 className="text-lg font-semibold">Report content</h3>
            <p className="mt-1 text-sm text-muted">
              Flag inappropriate, misleading, or spam content for moderation.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Textarea
                label="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe the issue..."
                rows={4}
                required
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full min-h-11 sm:w-auto"
                  disabled={loading}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full min-h-11 sm:w-auto" loading={loading}>
                  Submit report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
