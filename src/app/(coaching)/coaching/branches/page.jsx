"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { CityAutocomplete } from "@/components/shared/CityAutocomplete";
import { Badge } from "@/components/ui/Badge";
import { DashboardListSkeleton } from "@/components/ui/DashboardListSkeleton";

const emptyForm = {
  branchName: "",
  city: "",
  locality: "",
  address: "",
  phone: "",
  isPrimary: false,
};

export default function CoachingBranchesPage() {
  const { addToast } = useToast();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  async function loadBranches() {
    const res = await fetch("/api/branches");
    const data = await res.json();
    if (data.success) setBranches(data.data);
  }

  useEffect(() => {
    loadBranches().finally(() => setFetching(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(editingId ? `/api/branches/${editingId}` : "/api/branches", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setForm(emptyForm);
      setEditingId(null);
      loadBranches();
      addToast(editingId ? "Branch updated" : "Branch added", "success");
    } else {
      addToast(data.message || "Failed to save branch", "error");
    }
  }

  function startEdit(branch) {
    setEditingId(branch.id);
    setForm({
      branchName: branch.branchName || "",
      city: branch.city || "",
      locality: branch.locality || "",
      address: branch.address || "",
      phone: branch.phone || "",
      isPrimary: branch.isPrimary || false,
    });
  }

  async function handleDelete(id) {
    if (!confirm("Remove this branch? This cannot be undone.")) return;
    const res = await fetch(`/api/branches/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      loadBranches();
      addToast("Branch removed", "success");
    } else {
      addToast(data.message || "Failed to remove branch", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Branches</h1>
        <p className="mt-1 text-sm text-muted">Manage multiple locations for your institute.</p>
      </div>

      <Card className="max-w-2xl">
        <h2 className="text-lg font-semibold text-foreground">{editingId ? "Edit branch" : "Add branch"}</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input
            label="Branch name"
            value={form.branchName}
            onChange={(e) => setForm({ ...form, branchName: e.target.value })}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <CityAutocomplete label="City" value={form.city} onChange={(city) => setForm({ ...form, city })} />
            <Input label="Locality" value={form.locality} onChange={(e) => setForm({ ...form, locality: e.target.value })} />
          </div>
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.isPrimary}
              onChange={(e) => setForm({ ...form, isPrimary: e.target.checked })}
            />
            Set as primary branch
          </label>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" loading={loading} className="min-h-11 w-full sm:w-auto">
              {editingId ? "Save changes" : "Add branch"}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" className="min-h-11" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                Cancel edit
              </Button>
            )}
          </div>
        </form>
      </Card>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Your branches</h2>
        {fetching ? (
          <DashboardListSkeleton count={5} />
        ) : branches.length === 0 ? (
          <Card><p className="text-muted">No branches added yet.</p></Card>
        ) : (
          <div className="space-y-3">
            {branches.map((branch) => (
              <Card key={branch.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{branch.branchName}</p>
                    {branch.isPrimary && <Badge variant="success">Primary</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {[branch.locality, branch.city].filter(Boolean).join(", ") || "Location not set"}
                  </p>
                  {branch.address && <p className="mt-1 text-sm text-muted">{branch.address}</p>}
                  {branch.phone && <p className="mt-1 text-sm text-muted">{branch.phone}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" size="sm" className="min-h-10" onClick={() => startEdit(branch)}>
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="min-h-10"
                    onClick={() => handleDelete(branch.id)}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
