"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DemoRequestCard } from "@/components/coaching/DemoRequestCard";
import { cn } from "@/lib/utils/cn";

export default function CoachingBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("bookings");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const [bookingsRes, requestsRes] = await Promise.all([
      fetch("/api/bookings?scope=coaching"),
      fetch("/api/demo-requests?scope=coaching"),
    ]);
    const bookingsData = await bookingsRes.json();
    const requestsData = await requestsRes.json();
    if (bookingsData.success) setBookings(bookingsData.data);
    if (requestsData.success) setRequests(requestsData.data);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  function handleRequestUpdated(updated) {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    loadData();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Bookings & Requests</h1>
      <p className="text-muted">Students who booked demos or requested a slot</p>

      <div className="mt-6 flex gap-1 rounded-xl border border-border bg-surface-muted/40 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("bookings")}
          className={cn(
            "min-h-11 flex-1 rounded-lg px-4 py-2 text-sm font-medium transition",
            activeTab === "bookings"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          )}
        >
          Bookings
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("requests")}
          className={cn(
            "min-h-11 flex-1 rounded-lg px-4 py-2 text-sm font-medium transition",
            activeTab === "requests"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          )}
        >
          Requests
          {pendingCount > 0 && (
            <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-warning px-1 text-[10px] font-bold text-white">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <Card className="py-12 text-center text-sm text-muted">Loading...</Card>
        ) : activeTab === "bookings" ? (
          bookings.length === 0 ? (
            <EmptyState
              title="No bookings yet"
              description="Bookings appear when students reserve your demo slots."
            />
          ) : (
            bookings.map((b) => (
              <Card key={b.id}>
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="font-medium">{b.student.user.name}</p>
                    <p className="text-sm text-muted">
                      {b.student.user.email} · {b.student.user.phone}
                    </p>
                    <p className="text-sm text-muted">
                      {b.demoSlot.topic} · {new Date(b.demoSlot.demoDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="primary">{b.bookingCode}</Badge>
                    <Badge
                      variant={b.status === "CONFIRMED" ? "success" : "default"}
                      className="ml-2"
                    >
                      {b.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))
          )
        ) : requests.length === 0 ? (
          <EmptyState
            title="No demo requests yet"
            description="When students can't find an open slot, their requests will show up here."
          />
        ) : (
          requests.map((request) => (
            <DemoRequestCard
              key={request.id}
              request={request}
              onUpdated={handleRequestUpdated}
            />
          ))
        )}
      </div>
    </div>
  );
}
