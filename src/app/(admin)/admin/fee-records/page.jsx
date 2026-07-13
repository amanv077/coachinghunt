"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardListSkeleton } from "@/components/ui/DashboardListSkeleton";
import { useToast } from "@/components/ui/Toast";

const STATUS_VARIANTS = {
  PENDING: "warning",
  PAID: "success",
  DISPUTED: "danger",
  WAIVED: "default",
};

export default function AdminFeeRecordsPage() {
  const { addToast } = useToast();
  const [records, setRecords] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/admin/fee-records")
      .then((r) => r.json())
      .then((d) => d.success && setRecords(d.data))
      .finally(() => setFetching(false));
  }, []);

  async function updateStatus(id, status) {
    const res = await fetch(`/api/admin/fee-records/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      addToast(`Marked as ${status.toLowerCase()}`, "success");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Platform Fee Records</h1>
      <div className="mt-6 space-y-3">
        {fetching ? (
          <DashboardListSkeleton count={8} />
        ) : records.length === 0 ? (
          <Card><p className="text-muted">No fee records yet.</p></Card>
        ) : (
          records.map((record) => (
            <Card key={record.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{record.coaching.name}</p>
                <p className="text-sm text-muted">{record.enrolledByName || "Student"} · ₹{record.amount}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={STATUS_VARIANTS[record.status] || "default"}>{record.status}</Badge>
                {record.status === "PENDING" && (
                  <>
                    <Button size="sm" className="min-h-9" onClick={() => updateStatus(record.id, "PAID")}>Mark paid</Button>
                    <Button size="sm" variant="secondary" className="min-h-9" onClick={() => updateStatus(record.id, "DISPUTED")}>Dispute</Button>
                    <Button size="sm" variant="ghost" className="min-h-9" onClick={() => updateStatus(record.id, "WAIVED")}>Waive</Button>
                  </>
                )}
                {record.status === "DISPUTED" && (
                  <>
                    <Button size="sm" className="min-h-9" onClick={() => updateStatus(record.id, "PAID")}>Resolve paid</Button>
                    <Button size="sm" variant="ghost" className="min-h-9" onClick={() => updateStatus(record.id, "WAIVED")}>Waive</Button>
                  </>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
