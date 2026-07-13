"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";

function getMinDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

export function RescheduleBookingButton({ bookingId }) {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("16:00");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    setPreferredDate(getMinDate());
    setPreferredTime("16:00");
    setMessage("");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!preferredDate) {
      addToast("Please pick a new date", "error");
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/bookings/${bookingId}/reschedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferredDate,
        preferredTime,
        message: message.trim() || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      addToast("Reschedule request sent to coaching", "success");
      setOpen(false);
      window.location.reload();
    } else {
      addToast(data.message || "Failed to reschedule", "error");
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="min-h-9"
        onClick={() => setOpen(true)}
      >
        Reschedule
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close"
            onClick={() => !loading && setOpen(false)}
          />
          <div
            className={cn(
              "relative z-10 w-full max-w-md rounded-t-2xl border border-border bg-white p-5 shadow-xl sm:rounded-2xl"
            )}
          >
            <h2 className="text-lg font-semibold">Request new demo time</h2>
            <p className="mt-1 text-sm text-muted">
              Your current booking will be cancelled only after your reschedule request is submitted.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Input
                label="Preferred date"
                type="date"
                value={preferredDate}
                min={getMinDate()}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
              />
              <Input
                label="Preferred time"
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                required
              />
              <Textarea
                label="Message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Any notes for the coaching"
                rows={3}
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
                <Button
                  type="submit"
                  className="w-full min-h-11 sm:w-auto"
                  loading={loading}
                >
                  Submit request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
