"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { DashboardListSkeleton } from "@/components/ui/DashboardListSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";

const TABS = ["ALL", "NEW", "CONTACTED", "ENROLLED", "DROPPED"];

function formatCourseLabel(course) {
  if (!course) return "General inquiry";
  const exams = course.targetExams?.join(", ");
  return exams || course.title || "General inquiry";
}

export default function CoachingLeadsPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("ALL");
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [fetching, setFetching] = useState(true);

  async function loadData(status) {
    setFetching(true);
    const qs = status && status !== "ALL" ? `?leadStatus=${status}` : "";
    const res = await fetch(`/api/leads${qs}`);
    const data = await res.json();
    if (data.success) {
      setRequests(data.data.requests);
      setBookings(data.data.bookings);
    }
    setFetching(false);
  }

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  async function updateRequestStatus(id, leadStatus) {
    const res = await fetch(`/api/leads/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadStatus }),
    });
    const data = await res.json();
    if (data.success) {
      addToast("Lead updated", "success");
      loadData(activeTab);
    } else {
      addToast(data.message, "error");
    }
  }

  async function updateBookingStatus(id, leadStatus) {
    const res = await fetch(`/api/leads/bookings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadStatus }),
    });
    const data = await res.json();
    if (data.success) {
      addToast("Booking lead updated", "success");
      loadData(activeTab);
    } else {
      addToast(data.message, "error");
    }
  }

  const hasLeads = requests.length > 0 || bookings.length > 0;

  return (
    <div>
      <h1 className="text-2xl font-bold">Lead Manager</h1>
      <p className="mt-1 text-sm text-muted">Track demo requests and booking leads.</p>

      <div className="mt-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "min-h-11 shrink-0 rounded-lg px-4 py-2 text-sm font-medium",
              activeTab === tab ? "bg-white text-foreground shadow-sm" : "text-muted"
            )}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {fetching ? (
          <DashboardListSkeleton count={5} />
        ) : !hasLeads ? (
          <EmptyState
            title="No leads yet"
            description="Demo requests and booked students will appear here. Mark enrolled students to generate platform fees."
          />
        ) : (
          <>
            {requests.map((req) => (
              <Card key={req.id} className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{req.student.user.name}</p>
                    <p className="text-sm text-muted">
                      {req.student.user.email} · {req.student.user.phone || "No phone"}
                    </p>
                    <p className="text-sm text-muted">{formatCourseLabel(req.course)}</p>
                  </div>
                  <Badge variant="primary">{req.leadStatus}</Badge>
                </div>
                <Select
                  label="Update status"
                  value={req.leadStatus}
                  onChange={(e) => updateRequestStatus(req.id, e.target.value)}
                >
                  {TABS.filter((t) => t !== "ALL").map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </Select>
              </Card>
            ))}

            {bookings.map((b) => (
              <Card key={b.id} className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{b.student.user.name}</p>
                    <p className="text-sm text-muted">
                      {b.student.user.email} · {b.student.user.phone || "No phone"}
                    </p>
                    <p className="text-sm text-muted">
                      {b.demoSlot.topic} · {new Date(b.demoSlot.demoDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted">{formatCourseLabel(b.course)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="success">Booked · {b.bookingCode}</Badge>
                    <Badge variant="primary">{b.leadStatus}</Badge>
                  </div>
                </div>
                <Select
                  label="Update status"
                  value={b.leadStatus}
                  onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                >
                  {TABS.filter((t) => t !== "ALL").map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </Select>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
