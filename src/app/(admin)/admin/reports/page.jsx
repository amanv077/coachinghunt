"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardListSkeleton } from "@/components/ui/DashboardListSkeleton";
import { useToast } from "@/components/ui/Toast";

export default function AdminReportsPage() {
  const { addToast } = useToast();
  const [reports, setReports] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reports?status=PENDING")
      .then((r) => r.json())
      .then((d) => d.success && setReports(d.data))
      .finally(() => setFetching(false));
  }, []);

  async function moderate(id, status) {
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      setReports(reports.filter((r) => r.id !== id));
      addToast(`Report ${status.toLowerCase()}`, "success");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Content Reports</h1>
      <p className="text-muted">Flagged reviews and Q&A for moderation</p>
      <div className="mt-6 space-y-3">
        {fetching ? (
          <DashboardListSkeleton count={6} />
        ) : reports.length === 0 ? (
          <Card><p className="text-muted">No pending reports.</p></Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    Reported by {report.reporter.name}
                  </p>
                  <p className="text-sm text-muted">{report.reason}</p>
                  {report.review && (
                    <p className="mt-2 text-sm">
                      Review: ★ {report.review.rating} — {report.review.comment || "(no comment)"}
                    </p>
                  )}
                  {report.qa && (
                    <p className="mt-2 text-sm">
                      Q&A: {report.qa.question}
                      {report.qa.answer && ` — ${report.qa.answer}`}
                    </p>
                  )}
                  {report.coaching && (
                    <Badge variant="default" className="mt-2">{report.coaching.name}</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="min-h-9" onClick={() => moderate(report.id, "RESOLVED")}>
                    Resolve
                  </Button>
                  <Button size="sm" variant="secondary" className="min-h-9" onClick={() => moderate(report.id, "DISMISSED")}>
                    Dismiss
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
