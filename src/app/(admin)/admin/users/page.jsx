"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardListSkeleton } from "@/components/ui/DashboardListSkeleton";
import { useToast } from "@/components/ui/Toast";

export default function AdminUsersPage() {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => d.success && setUsers(d.data.items))
      .finally(() => setFetching(false));
  }, []);

  async function toggleStatus(id, isActive) {
    const res = await fetch(`/api/admin/users/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    const data = await res.json();
    if (data.success) {
      setUsers(users.map((u) => (u.id === id ? { ...u, isActive: !isActive } : u)));
      addToast("User status updated", "success");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="mt-6 space-y-3">
        {fetching ? (
          <DashboardListSkeleton count={8} />
        ) : (
          users.map((u) => (
          <Card key={u.id} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-muted">{u.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="primary">{u.role}</Badge>
              <Badge variant={u.isActive ? "success" : "danger"}>{u.isActive ? "Active" : "Inactive"}</Badge>
              <Button size="sm" variant="ghost" onClick={() => toggleStatus(u.id, u.isActive)}>
                {u.isActive ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </Card>
          ))
        )}
      </div>
    </div>
  );
}
