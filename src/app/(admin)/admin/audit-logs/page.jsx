"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/api/admin/audit-logs").then((r) => r.json()).then((d) => d.success && setLogs(d.data.items));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Audit Logs</h1>
      <div className="mt-6 space-y-3">
        {logs.length === 0 ? (
          <Card><p className="text-muted">No audit logs yet.</p></Card>
        ) : (
          logs.map((log) => (
            <Card key={log.id} className="text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{log.action}</p>
                <Badge>{log.actorRole}</Badge>
              </div>
              <p className="mt-1 text-muted">{log.actor.name} · {log.entityType} · {log.entityId}</p>
              <p className="mt-1 text-xs text-muted">{new Date(log.createdAt).toLocaleString()}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
