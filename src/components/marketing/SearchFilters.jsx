"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  }

  return (
    <Card className="h-fit">
      <h3 className="font-semibold">Filters</h3>
      <form onSubmit={applyFilters} className="mt-4 space-y-3">
        <Input label="Keyword" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <Input label="City" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
        <Select label="Target Exam" value={filters.targetExam} onChange={(e) => setFilters({ ...filters, targetExam: e.target.value })}>
          <option value="">All</option>
          <option value="JEE">JEE</option>
          <option value="NEET">NEET</option>
          <option value="Boards">Boards</option>
        </Select>
        <Input label="Subject" value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })} />
        <Button type="submit" className="w-full">Apply Filters</Button>
      </form>
    </Card>
  );
}
