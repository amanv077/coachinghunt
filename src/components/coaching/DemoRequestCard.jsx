"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { DemoRequestStatusBadge } from "@/components/shared/DemoRequestStatusBadge";
import { formatDemoDate } from "@/lib/utils/helpers";
import { cn } from "@/lib/utils/cn";

const TIME_LABELS = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

export function DemoRequestCard({ request, onUpdated }) {
  const [activeAction, setActiveAction] = useState(null);
  const [date, setDate] = useState(
    request.preferredDate ? new Date(request.preferredDate).toISOString().split("T")[0] : getTomorrowDate()
  );
  const [startTime, setStartTime] = useState("16:00");
  const [responseNote, setResponseNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPending = request.status === "PENDING";

  function toggleAction(action) {
    setActiveAction(activeAction === action ? null : action);
    setError("");
    if (action === "approve" && request.preferredDate) {
      setDate(new Date(request.preferredDate).toISOString().split("T")[0]);
    }
    if (action === "reschedule") {
      setDate(getTomorrowDate());
    }
  }

  async function handleRespond(action) {
    setLoading(true);
    setError("");

    const res = await fetch(`/api/demo-requests/${request.id}/respond`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        date: action === "decline" ? undefined : date,
        startTime: action === "decline" ? undefined : startTime,
        responseNote: responseNote.trim() || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setActiveAction(null);
      setResponseNote("");
      onUpdated?.(data.data);
    } else {
      setError(data.message || "Could not update request");
    }
  }

  const bookingCode = request.resultingSlot?.bookings?.[0]?.bookingCode;

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-foreground">{request.student.user.name}</p>
            <DemoRequestStatusBadge status={request.status} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {request.student.user.email}
            {request.student.user.phone ? ` · ${request.student.user.phone}` : ""}
          </p>
          {request.course?.title && (
            <p className="mt-2 text-sm text-foreground">{request.course.title}</p>
          )}
          {request.preferredDate && (
            <p className="mt-1 text-sm text-muted">
              Requested: {formatDemoDate(request.preferredDate)}
              {request.preferredTime
                ? ` · ${TIME_LABELS[request.preferredTime] || request.preferredTime}`
                : ""}
            </p>
          )}
          {request.message && (
            <p className="mt-2 rounded-lg bg-surface-muted/60 px-3 py-2 text-sm text-muted">
              &ldquo;{request.message}&rdquo;
            </p>
          )}
          {request.proposedDate && request.status !== "PENDING" && request.status !== "DECLINED" && (
            <p className="mt-2 text-sm font-medium text-success">
              Confirmed: {formatDemoDate(request.proposedDate)} · {request.proposedTime}
            </p>
          )}
          {request.responseNote && request.status === "DECLINED" && (
            <p className="mt-2 text-sm text-danger">Reason: {request.responseNote}</p>
          )}
          {request.responseNote && request.status === "RESCHEDULED" && (
            <p className="mt-2 text-sm text-muted">Note: {request.responseNote}</p>
          )}
        </div>
        {bookingCode && (
          <Badge variant="primary" className="shrink-0 self-start">
            {bookingCode}
          </Badge>
        )}
      </div>

      {isPending && (
        <>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              className="min-h-11"
              variant={activeAction === "approve" ? "primary" : "secondary"}
              onClick={() => toggleAction("approve")}
            >
              Approve
            </Button>
            <Button
              size="sm"
              className="min-h-11"
              variant={activeAction === "reschedule" ? "primary" : "secondary"}
              onClick={() => toggleAction("reschedule")}
            >
              Reschedule
            </Button>
            <Button
              size="sm"
              className="min-h-11"
              variant={activeAction === "decline" ? "danger" : "ghost"}
              onClick={() => toggleAction("decline")}
            >
              Decline
            </Button>
          </div>

          {activeAction && (
            <div
              className={cn(
                "rounded-xl border p-4",
                activeAction === "decline" ? "border-danger/20 bg-red-50/50" : "border-border bg-surface-muted/30"
              )}
            >
              {activeAction === "decline" ? (
                <div className="space-y-3">
                  <Textarea
                    label="Reason for declining"
                    placeholder="Let the student know why you can't accommodate this request"
                    rows={3}
                    value={responseNote}
                    onChange={(e) => setResponseNote(e.target.value)}
                    required
                  />
                  <Button
                    variant="danger"
                    className="min-h-11 w-full sm:w-auto"
                    loading={loading}
                    onClick={() => handleRespond("decline")}
                  >
                    Decline request
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    {activeAction === "approve"
                      ? "Confirm demo date and time"
                      : "Suggest an alternative date and time"}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      label="Date"
                      type="date"
                      min={getTomorrowDate()}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                    <Input
                      label="Start time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                  {activeAction === "reschedule" && (
                    <Textarea
                      label="Note to student (optional)"
                      placeholder="e.g. Your preferred date is full — here's another slot"
                      rows={2}
                      value={responseNote}
                      onChange={(e) => setResponseNote(e.target.value)}
                    />
                  )}
                  <Button
                    className="min-h-11 w-full sm:w-auto"
                    loading={loading}
                    onClick={() => handleRespond(activeAction)}
                  >
                    {activeAction === "approve" ? "Confirm demo" : "Send new time"}
                  </Button>
                </div>
              )}
              {error && <p className="mt-2 text-sm text-danger">{error}</p>}
            </div>
          )}
        </>
      )}
    </Card>
  );
}
