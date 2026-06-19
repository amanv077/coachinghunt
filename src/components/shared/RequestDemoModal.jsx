"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils/cn";

const TIME_OPTIONS = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

function getMinDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

export function RequestDemoModal({
  open,
  onClose,
  coachingId,
  courseId,
  coachingName,
  courseTitle,
}) {
  const router = useRouter();
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPreferredDate("");
    setPreferredTime("");
    setMessage("");
    setError("");
    setSuccess(false);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!preferredDate) {
      setError("Please pick a preferred date");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/demo-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coachingId,
        courseId: courseId || undefined,
        preferredDate,
        preferredTime: preferredTime || undefined,
        message: message.trim() || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setSuccess(true);
      router.refresh();
    } else {
      setError(data.message || "Could not send request");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-demo-title"
        className="relative z-10 w-full max-w-lg rounded-t-2xl border border-border bg-white p-5 shadow-xl md:rounded-2xl md:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="request-demo-title" className="text-lg font-semibold text-foreground">
              Request a demo
            </h2>
            <p className="mt-1 text-sm text-muted">
              {courseTitle
                ? `${courseTitle} · ${coachingName}`
                : coachingName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-muted"
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="rounded-xl border border-success/20 bg-green-50 px-4 py-5 text-center">
            <p className="font-semibold text-foreground">Request sent!</p>
            <p className="mt-2 text-sm text-muted">
              We&apos;ll notify you when the coaching confirms or suggests another time.
            </p>
            <Button className="mt-4 min-h-11 w-full" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Preferred date"
              type="date"
              min={getMinDate()}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
            />

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Preferred time of day</p>
              <div className="flex flex-wrap gap-2">
                {TIME_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setPreferredTime(preferredTime === option.value ? "" : option.value)
                    }
                    className={cn(
                      "min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition",
                      preferredTime === option.value
                        ? "border-secondary bg-secondary-light text-secondary"
                        : "border-border bg-white text-muted hover:border-secondary/40"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              label="Message (optional)"
              placeholder="Anything you'd like the coaching to know?"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {error && <p className="text-sm text-danger">{error}</p>}

            <Button type="submit" loading={loading} className="min-h-11 w-full">
              Send request
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
