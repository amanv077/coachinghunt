"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function AdminLeadCounts({ leads = [] }) {
  const [paidOnly, setPaidOnly] = useState(false);

  const rows = useMemo(() => {
    if (!paidOnly) return leads;
    return leads.filter((row) => row.paidLeads > 0);
  }, [leads, paidOnly]);

  if (leads.length === 0) return null;

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Lead counts by coaching</h2>
          <p className="text-sm text-muted">Demo requests tracked as leads (paid lead pack foundation).</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant={paidOnly ? "primary" : "secondary"}
          className="min-h-11 w-full sm:w-auto"
          onClick={() => setPaidOnly((v) => !v)}
        >
          {paidOnly ? "Showing paid leads only" : "Show paid leads only"}
        </Button>
      </div>
      <div className="mt-4 space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-muted">No paid leads yet.</p>
        ) : (
          rows.map((row) => (
            <div key={row.coachingId} className="flex flex-col gap-2 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-muted">{row.city}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">{row.totalLeads} total</Badge>
                {row.paidLeads > 0 && <Badge variant="warning">{row.paidLeads} paid</Badge>}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
