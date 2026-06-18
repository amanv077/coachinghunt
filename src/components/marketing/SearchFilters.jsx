"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

function FilterForm({ filters, setFilters, onSubmit, onClear, className }) {
  return (
    <form onSubmit={onSubmit} className={cn("space-y-3", className)}>
      <Input
        label="Keyword"
        value={filters.q}
        onChange={(e) => setFilters({ ...filters, q: e.target.value })}
      />
      <Input
        label="City"
        value={filters.city}
        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
      />
      <Select
        label="Target Exam"
        value={filters.targetExam}
        onChange={(e) => setFilters({ ...filters, targetExam: e.target.value })}
      >
        <option value="">All</option>
        <option value="JEE">JEE</option>
        <option value="NEET">NEET</option>
        <option value="Boards">Boards</option>
        <option value="Foundation">Foundation</option>
      </Select>
      <Input
        label="Subject"
        value={filters.subject}
        onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
      />
      <div className="flex gap-2 pt-1">
        <Button type="submit" className="min-h-11 flex-1">
          Apply Filters
        </Button>
        {onClear && (
          <Button type="button" variant="ghost" className="min-h-11" onClick={onClear}>
            Clear
          </Button>
        )}
      </div>
    </form>
  );
}

export function SearchFilters({ mobileOnly = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    city: searchParams.get("city") || "",
    targetExam: searchParams.get("targetExam") || "",
    subject: searchParams.get("subject") || "",
  });

  function applyFilters(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
    router.push(`/search?${params.toString()}`);
    setDrawerOpen(false);
  }

  function clearFilters() {
    setFilters({ q: "", city: "", targetExam: "", subject: "" });
    router.push("/search");
    setDrawerOpen(false);
  }

  if (mobileOnly) {
    return (
      <>
        <Button
          type="button"
          variant="secondary"
          className="min-h-11 w-full lg:hidden"
          onClick={() => setDrawerOpen(true)}
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </Button>

        {drawerOpen && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              aria-hidden
              onClick={() => setDrawerOpen(false)}
            />
            <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl lg:hidden">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  type="button"
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-muted"
                  aria-label="Close filters"
                  onClick={() => setDrawerOpen(false)}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <FilterForm
                filters={filters}
                setFilters={setFilters}
                onSubmit={applyFilters}
                onClear={clearFilters}
              />
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <Card className="hidden h-fit lg:block">
      <h3 className="font-semibold">Filters</h3>
      <FilterForm
        filters={filters}
        setFilters={setFilters}
        onSubmit={applyFilters}
        onClear={clearFilters}
        className="mt-4"
      />
    </Card>
  );
}

export function ActiveFilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const chips = [
    { key: "q", label: searchParams.get("q") },
    { key: "city", label: searchParams.get("city") },
    { key: "targetExam", label: searchParams.get("targetExam") },
    { key: "subject", label: searchParams.get("subject") },
  ].filter((c) => c.label);

  if (chips.length === 0) return null;

  function removeFilter(key) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => removeFilter(chip.key)}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-secondary/20 bg-secondary-light px-3 py-1 text-xs font-medium text-secondary"
        >
          {chip.label}
          <span aria-hidden>×</span>
        </button>
      ))}
    </div>
  );
}

export function SearchResultHeader({ total, params }) {
  const parts = [];
  if (total === 0) parts.push("No coachings found");
  else parts.push(`${total} coaching${total !== 1 ? "s" : ""} found`);
  if (params.city) parts.push(`in ${params.city}`);
  if (params.targetExam) parts.push(`for ${params.targetExam}`);
  if (params.q && !params.city) parts.push(`matching "${params.q}"`);

  return (
    <p className="mt-1 text-sm text-muted sm:text-base">{parts.join(" ")}</p>
  );
}
