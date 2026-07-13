"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DashboardListSkeleton } from "@/components/ui/DashboardListSkeleton";
import { useToast } from "@/components/ui/Toast";

export function AdminUsersClient() {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = useCallback(async () => {
    setFetching(true);
    const params = new URLSearchParams({ page: String(page), search });
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    if (data.success) {
      setUsers(data.data.items);
      setTotalPages(data.data.totalPages || 1);
    }
    setFetching(false);
  }, [page, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function toggleStatus(id, isActive) {
    const res = await fetch(`/api/admin/users/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    const data = await res.json();
    if (data.success) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive: !isActive } : u)));
      addToast("User status updated", "success");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <Input
          label="Search"
          placeholder="Name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button type="button" className="min-h-11" onClick={() => { setPage(1); loadUsers(); }}>
          Search
        </Button>
      </div>

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

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
