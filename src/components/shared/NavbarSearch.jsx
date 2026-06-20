"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

export function NavbarSearch({ className, inputClassName, placeholder = "Search coachings…", onSearch }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    const params = new URLSearchParams();

    if (trimmed) params.set("q", trimmed);

    const city = searchParams.get("city");
    const targetExam = searchParams.get("targetExam");
    const subject = searchParams.get("subject");
    const maxFee = searchParams.get("maxFee");
    const sort = searchParams.get("sort");

    if (city) params.set("city", city);
    if (targetExam) params.set("targetExam", targetExam);
    if (subject) params.set("subject", subject);
    if (maxFee) params.set("maxFee", maxFee);
    if (sort) params.set("sort", sort);

    onSearch?.();
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative flex items-center", className)}>
      <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-muted" />
      <input
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        aria-label="Search coachings"
        className={cn(
          "w-full min-h-11 rounded-xl border border-border bg-surface-muted py-2 pl-9 pr-3 text-sm text-foreground outline-none transition",
          "placeholder:text-muted focus:border-secondary/40 focus:bg-white focus:ring-2 focus:ring-secondary/20",
          inputClassName
        )}
      />
    </form>
  );
}
