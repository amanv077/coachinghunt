"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardListSkeleton } from "@/components/ui/DashboardListSkeleton";
import { useToast } from "@/components/ui/Toast";

export default function AdminBlogQueriesPage() {
  const { addToast } = useToast();
  const [queries, setQueries] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/admin/blog-query")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setQueries(d.data);
        } else {
          addToast(d.message || "Failed to load queries", "error");
        }
      })
      .catch(() => addToast("Failed to load queries", "error"))
      .finally(() => setFetching(false));
  }, [addToast]);

  async function updateStatus(id, newStatus) {
    try {
      const res = await fetch(`/api/admin/blog-query/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setQueries(
          queries.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
        );
        addToast(`Query marked as ${newStatus.toLowerCase()}`, "success");
      } else {
        addToast(data.message || "Failed to update status", "error");
      }
    } catch (err) {
      addToast("Failed to update status", "error");
    }
  }

  function getStatusBadge(status) {
    switch (status) {
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>;
      case "CONTACTED":
        return <Badge variant="success">Contacted</Badge>;
      case "FAKE":
        return <Badge variant="danger">Fake</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Blog Queries</h1>
        <p className="text-sm text-muted">Manage counseling requests submitted by students from blog posts</p>
      </div>

      <div className="mt-6 space-y-4">
        {fetching ? (
          <DashboardListSkeleton count={5} />
        ) : queries.length === 0 ? (
          <Card>
            <p className="text-center py-10 text-muted">No queries submitted yet.</p>
          </Card>
        ) : (
          queries.map((q) => (
            <Card key={q.id} className="p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-lg font-bold text-foreground">{q.name}</span>
                    {getStatusBadge(q.status)}
                  </div>
                  <div className="text-sm space-y-1.5">
                    <p className="text-muted">
                      <strong className="text-foreground">Email:</strong> {q.email}
                    </p>
                    <p className="text-muted">
                      <strong className="text-foreground">Phone:</strong> {q.phone}
                    </p>
                    <p className="text-muted">
                      <strong className="text-foreground">From Blog:</strong>{" "}
                      <Link
                        href={`/blog/${q.blogSlug}`}
                        target="_blank"
                        className="text-secondary hover:underline font-medium"
                      >
                        {q.blogTitle}
                      </Link>
                    </p>
                    <p className="text-xs text-muted/80">
                      Submitted on: {new Date(q.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 self-end sm:self-start">
                  {q.status !== "PENDING" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateStatus(q.id, "PENDING")}
                    >
                      Mark Pending
                    </Button>
                  )}
                  {q.status !== "CONTACTED" && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => updateStatus(q.id, "CONTACTED")}
                    >
                      Mark Contacted
                    </Button>
                  )}
                  {q.status !== "FAKE" && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => updateStatus(q.id, "FAKE")}
                    >
                      Mark Fake
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
