"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function AdminFeeRecordsPage() {
  const { addToast } = useToast();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch("/api/admin/fee-records").then((r) => r.json()).then((d) => d.success && setRecords(d.data));
  }, []);

  async function markPaid(id) {
    const res = await fetch(`/api/admin/fee-records/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PAID" }),
    });
    const data = await res.json();
    if (data.success) {
      setRecords(records.map((r) => (r.id === id ? { ...r, status: "PAID" } : r)));
      addToast("Marked as paid", "success");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Platform Fee Records</h1>
      <div className="mt-6 space-y-3">
        {records.length === 0 ? (
          <Card><p className="text-muted">No fee records yet.</p></Card>
        ) : (
          records.map((record) => (
            <Card key={record.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{record.coaching.name}</p>
                <p className="text-sm text-muted">{record.enrolledByName || "Student"} · ₹{record.amount}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={record.status === "PAID" ? "success" : "warning"}>{record.status}</Badge>
                {record.status !== "PAID" && (
                  <Button size="sm" onClick={() => markPaid(record.id)}>Mark paid</Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
