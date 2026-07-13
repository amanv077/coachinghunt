"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DashboardListSkeleton } from "@/components/ui/DashboardListSkeleton";
import { useToast } from "@/components/ui/Toast";

export function AdminCoachingsClient({ initialPage = 1 }) {
  const { addToast } = useToast();
  const [coachings, setCoachings] = useState([]);
  const [featuredRequests, setFeaturedRequests] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("coachings");

  const loadCoachings = useCallback(async () => {
    setFetching(true);
    const params = new URLSearchParams({ page: String(page), search });
    const res = await fetch(`/api/admin/coachings?${params}`);
    const data = await res.json();
    if (data.success) {
      setCoachings(data.data.items);
      setTotalPages(data.data.totalPages || 1);
    }
    setFetching(false);
  }, [page, search]);

  const loadFeaturedRequests = useCallback(async () => {
    const res = await fetch("/api/admin/featured-requests?status=PENDING");
    const data = await res.json();
    if (data.success) setFeaturedRequests(data.data);
  }, []);

  useEffect(() => {
    if (activeTab === "coachings") loadCoachings();
    else loadFeaturedRequests();
  }, [activeTab, loadCoachings, loadFeaturedRequests]);

  async function verify(id, status) {
    const res = await fetch(`/api/admin/coachings/${id}/verify`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verificationStatus: status }),
    });
    const data = await res.json();
    if (data.success) {
      setCoachings((prev) => prev.map((c) => (c.id === id ? { ...c, verificationStatus: status } : c)));
      addToast(`Coaching ${status.toLowerCase()}`, "success");
    }
  }

  async function toggleFeature(id, isFeatured) {
    const res = await fetch(`/api/admin/coachings/${id}/feature`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isFeatured,
        featuredUntil: isFeatured ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setCoachings((prev) => prev.map((c) => (c.id === id ? { ...c, isFeatured } : c)));
      addToast(isFeatured ? "Marked as featured" : "Removed from featured", "success");
    }
  }

  async function respondFeatured(id, status) {
    const res = await fetch(`/api/admin/featured-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      setFeaturedRequests((prev) => prev.filter((r) => r.id !== id));
      addToast(`Request ${status.toLowerCase()}`, "success");
      loadCoachings();
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Coachings</h1>

      <div className="mt-4 flex gap-2">
        <Button
          size="sm"
          variant={activeTab === "coachings" ? "primary" : "secondary"}
          onClick={() => setActiveTab("coachings")}
        >
          All coachings
        </Button>
        <Button
          size="sm"
          variant={activeTab === "featured" ? "primary" : "secondary"}
          onClick={() => setActiveTab("featured")}
        >
          Featured requests
          {featuredRequests.length > 0 && (
            <span className="ml-1.5 rounded-full bg-warning px-1.5 text-[10px] text-white">
              {featuredRequests.length}
            </span>
          )}
        </Button>
      </div>

      {activeTab === "coachings" && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <Input
            label="Search"
            placeholder="Name, city, or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="button" className="min-h-11" onClick={() => { setPage(1); loadCoachings(); }}>
            Search
          </Button>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {fetching && activeTab === "coachings" ? (
          <DashboardListSkeleton count={8} />
        ) : activeTab === "featured" ? (
          featuredRequests.length === 0 ? (
            <Card><p className="text-muted">No pending featured requests.</p></Card>
          ) : (
            featuredRequests.map((request) => (
              <Card key={request.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{request.coaching.name}</p>
                  <p className="text-sm text-muted">{request.coaching.city} · {request.coaching.user.email}</p>
                  {request.note && <p className="mt-1 text-sm">{request.note}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => respondFeatured(request.id, "APPROVED")}>Approve</Button>
                  <Button size="sm" variant="secondary" onClick={() => respondFeatured(request.id, "REJECTED")}>Reject</Button>
                </div>
              </Card>
            ))
          )
        ) : (
          coachings.map((c) => (
            <Card key={c.id} className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-muted">{c.city} · {c.user.email}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant={c.verificationStatus === "VERIFIED" ? "success" : "warning"}>{c.verificationStatus}</Badge>
                  <Badge>{c.listingStatus}</Badge>
                  {c.isFeatured && <Badge variant="warning">Featured</Badge>}
                  {c.isPremium && <Badge variant="primary">Premium</Badge>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {c.verificationStatus !== "VERIFIED" && (
                  <Button size="sm" className="min-h-9" onClick={() => verify(c.id, "VERIFIED")}>Verify</Button>
                )}
                {c.verificationStatus !== "REJECTED" && (
                  <Button size="sm" variant="danger" className="min-h-9" onClick={() => verify(c.id, "REJECTED")}>Reject</Button>
                )}
                <Button size="sm" variant="secondary" className="min-h-9" onClick={() => toggleFeature(c.id, !c.isFeatured)}>
                  {c.isFeatured ? "Unfeature" : "Feature"}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {activeTab === "coachings" && totalPages > 1 && (
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
