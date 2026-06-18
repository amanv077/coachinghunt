"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const QUICK_EXAMS = ["JEE", "NEET", "Boards", "Foundation"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "rating", label: "Top rated" },
];

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

function buildSearchUrl(searchParams, updates) {
  const params = new URLSearchParams(searchParams.toString());
  Object.entries(updates).forEach(([key, value]) => {
    if (value) params.set(key, value);
    else params.delete(key);
  });
  if ("q" in updates || "city" in updates || "targetExam" in updates || "subject" in updates) {
    params.delete("page");
  }
  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}

export function SearchToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const activeExam = searchParams.get("targetExam") || "";
  const activeSort = searchParams.get("sort") || "newest";

  function handleSearch(e) {
    e.preventDefault();
    router.push(buildSearchUrl(searchParams, { q: q.trim(), city: city.trim() }));
  }

  function toggleExam(exam) {
    router.push(
      buildSearchUrl(searchParams, {
        targetExam: activeExam === exam ? "" : exam,
      })
    );
  }

  function handleSortChange(e) {
    router.push(buildSearchUrl(searchParams, { sort: e.target.value }));
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="min-h-11 flex-1">
            <Input
              placeholder="Search coaching name, exam, or area..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search coachings"
            />
          </div>
          <div className="min-h-11 sm:w-40">
            <Input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="City"
            />
          </div>
          <Button type="submit" className="min-h-11 w-full sm:w-auto sm:shrink-0">
            Search
          </Button>
        </form>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted">Popular exams:</span>
          {QUICK_EXAMS.map((exam) => (
            <button
              key={exam}
              type="button"
              onClick={() => toggleExam(exam)}
              className={cn(
                "min-h-9 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
                activeExam === exam
                  ? "border-secondary bg-secondary text-white"
                  : "border-secondary/20 bg-white text-secondary hover:border-secondary hover:bg-secondary-light"
              )}
            >
              {exam}
            </button>
          ))}
        </div>
        <Select
          value={activeSort}
          onChange={handleSortChange}
          className="min-h-11 w-full sm:w-44"
          aria-label="Sort results"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
      </div>
    </div>
  );
}

export function SearchPagination({ page, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(nextPage) {
    router.push(
      buildSearchUrl(searchParams, { page: nextPage <= 1 ? "" : String(nextPage) })
    );
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <Button
        variant="secondary"
        className="min-h-11"
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-muted">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="secondary"
        className="min-h-11"
        disabled={page >= totalPages}
        onClick={() => goToPage(page + 1)}
      >
        Next
      </Button>
    </div>
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
    router.push(buildSearchUrl(searchParams, filters));
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
