"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function ExamMultiSelect({
  value = [],
  onChange,
  label = "Exams / courses you're preparing for",
  error,
  placeholder = "Type exam name…",
  id,
}) {
  const inputId = id || "exams";
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    if (!open || debouncedQuery.trim().length < 1) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/exams?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.success) {
          const filtered = d.data.filter((exam) => !value.includes(exam.name));
          setSuggestions(filtered);
          setActiveIndex(-1);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, open, value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function addExam(examName) {
    if (!examName || value.includes(examName)) return;
    onChange([...value, examName]);
    setQuery("");
    setSuggestions([]);
    setOpen(false);
  }

  function removeExam(examName) {
    onChange(value.filter((e) => e !== examName));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        addExam(suggestions[activeIndex].name);
      } else if (query.trim() && !value.includes(query.trim())) {
        addExam(query.trim());
      }
      return;
    }

    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((exam) => (
            <button
              key={exam}
              type="button"
              onClick={() => removeExam(exam)}
              className="inline-flex min-h-9 items-center gap-1 rounded-full bg-secondary-light px-3 py-1 text-sm font-medium text-secondary transition hover:bg-secondary/20"
              aria-label={`Remove ${exam}`}
            >
              <span>{exam}</span>
              <span className="text-secondary/70" aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20 min-h-11",
            error ? "border-danger" : "border-border"
          )}
        />

        {open && query.trim().length >= 1 && (
          <ul
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-white shadow-lg"
            role="listbox"
          >
            {loading && (
              <li className="px-3 py-3 text-sm text-muted">Searching exams…</li>
            )}
            {!loading && suggestions.length === 0 && (
              <li className="px-3 py-3 text-sm text-muted">
                No matches — press Enter to add &quot;{query.trim()}&quot;
              </li>
            )}
            {!loading &&
              suggestions.map((exam, index) => (
                <li key={exam.name} role="option" aria-selected={index === activeIndex}>
                  <button
                    type="button"
                    className={cn(
                      "w-full px-3 py-3 text-left text-sm transition min-h-11",
                      index === activeIndex
                        ? "bg-secondary-light text-secondary"
                        : "text-foreground hover:bg-surface-muted"
                    )}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addExam(exam.name);
                    }}
                  >
                    {exam.name}
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}
      <p className="text-xs text-muted">Add multiple exams. Tap × to remove.</p>
    </div>
  );
}
