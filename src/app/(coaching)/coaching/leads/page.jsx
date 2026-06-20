"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";

const TABS = ["ALL", "NEW", "CONTACTED", "ENROLLED", "DROPPED"];

export default function CoachingLeadsPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("ALL");
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);

  async function loadData(status) {
    const qs = status && status !== "ALL" ? `?leadStatus=${status}` : "";
    const res = await fetch(`/api/leads${qs}`);
    const data = await res.json();
    if (data.success) {
      setRequests(data.data.requests);
      setBookings(data.data.bookings);
    }
  }

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  async function updateStatus(id, leadStatus) {
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
        {requests.map((req) => (
          <Card key={req.id} className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{req.student.user.name}</p>
                <p className="text-sm text-muted">{req.student.user.email} · {req.student.user.phone || "No phone"}</p>
                <p className="text-sm text-muted">{req.course?.targetExam || req.course?.title || "General inquiry"}</p>
              </div>
              <Badge variant="primary">{req.leadStatus}</Badge>
            </div>
            <Select
              label="Update status"
              value={req.leadStatus}
              onChange={(e) => updateStatus(req.id, e.target.value)}
            >
              {TABS.filter((t) => t !== "ALL").map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>
          </Card>
        ))}

        {(activeTab === "ALL" || activeTab === "NEW") &&
          bookings.map((b) => (
            <Card key={b.id}>
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-medium">{b.student.user.name}</p>
                  <p className="text-sm text-muted">{b.demoSlot.topic} · {new Date(b.demoSlot.demoDate).toLocaleDateString()}</p>
                </div>
                <Badge variant="success">Booked · {b.bookingCode}</Badge>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}
