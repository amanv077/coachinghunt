"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DashboardListSkeleton } from "@/components/ui/DashboardListSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CoachingBillingPage() {
  const [records, setRecords] = useState([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [paidTotal, setPaidTotal] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/coaching/billing")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setRecords(d.data.records);
          setPendingTotal(d.data.pendingTotal);
          setPaidTotal(d.data.paidTotal);
        } else {
          setError(d.message || "Failed to load billing");
        }
      })
      .catch(() => setError("Failed to load billing"))
      .finally(() => setFetching(false));
  }, []);

  function leadName(record) {
    if (record.booking?.student?.user?.name) return record.booking.student.user.name;
    if (record.demoRequest?.student?.user?.name) return record.demoRequest.student.user.name;
    return record.enrolledByName || "Student";
  }

  if (fetching) return <DashboardListSkeleton count={4} />;

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <Card className="mt-6 border-danger/30 bg-danger/5">
          <p className="text-sm text-danger">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Billing</h1>
      <p className="mt-1 text-sm text-muted">
        Platform fees for enrolled students. Pay pending amounts via bank transfer; admin will mark as paid.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-muted">Pending fees</p>
          <p className="mt-1 text-2xl font-bold text-foreground">₹{pendingTotal.toLocaleString("en-IN")}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Paid to date</p>
          <p className="mt-1 text-2xl font-bold text-foreground">₹{paidTotal.toLocaleString("en-IN")}</p>
        </Card>
      </div>

      <div className="mt-6 space-y-3">
        {records.length === 0 ? (
          <EmptyState
            title="No fee records yet"
            description="When you mark a lead as Enrolled, a platform fee will appear here."
          />
        ) : (
          records.map((record) => (
            <Card key={record.id} className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{leadName(record)}</p>
                <p className="text-sm text-muted">
                  {record.booking?.bookingCode ? `Booking ${record.booking.bookingCode}` : "Demo request lead"}
                </p>
                <p className="text-sm text-muted">{new Date(record.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{record.amount.toLocaleString("en-IN")}</p>
                <Badge variant={record.status === "PAID" ? "success" : "warning"} className="mt-1">
                  {record.status}
                </Badge>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
