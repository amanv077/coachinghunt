"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CoachingBookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("/api/bookings?scope=coaching")
      .then((r) => r.json())
      .then((d) => d.success && setBookings(d.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Bookings & Leads</h1>
      <p className="text-muted">Students who booked demo sessions</p>
      <div className="mt-6 space-y-3">
        {bookings.length === 0 ? (
          <EmptyState title="No bookings yet" description="Bookings will appear when students book your demo slots." />
        ) : (
          bookings.map((b) => (
            <Card key={b.id}>
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <p className="font-medium">{b.student.user.name}</p>
                  <p className="text-sm text-muted">{b.student.user.email} · {b.student.user.phone}</p>
                  <p className="text-sm text-muted">{b.demoSlot.topic} · {new Date(b.demoSlot.demoDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <Badge variant="primary">{b.bookingCode}</Badge>
                  <Badge variant={b.status === "CONFIRMED" ? "success" : "default"} className="ml-2">{b.status}</Badge>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
