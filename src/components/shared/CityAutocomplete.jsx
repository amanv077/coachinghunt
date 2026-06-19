"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function CityAutocomplete({
  value = "",
  onChange,
  label = "City",
  required = false,
  error,
  placeholder = "Type your city…",
  id,
  name,
}) {
  const inputId = id || name || "city";
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const debouncedQuery = useDebouncedValue(inputValue, 300);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    if (!open || debouncedQuery.trim().length < 1) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/cities?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.success) {
          setSuggestions(d.data);
          setActiveIndex(-1);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, open]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectCity = useCallback(
    (cityName) => {
      setInputValue(cityName);
      onChange(cityName);
      setOpen(false);
      setSuggestions([]);
    },
    [onChange]
  );

  function handleKeyDown(e) {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectCity(suggestions[activeIndex].name);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type="text"
        value={inputValue}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => {
          const next = e.target.value;
          setInputValue(next);
          onChange(next);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20 min-h-11",
          error ? "border-danger" : "border-border"
        )}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
      {open && inputValue.trim().length >= 1 && (
        <ul
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-white shadow-lg"
          role="listbox"
        >
          {loading && (
            <li className="px-3 py-3 text-sm text-muted">Searching cities…</li>
          )}
          {!loading && suggestions.length === 0 && (
            <li className="px-3 py-3 text-sm text-muted">No cities found</li>
          )}
          {!loading &&
            suggestions.map((city, index) => (
              <li key={city.name} role="option" aria-selected={index === activeIndex}>
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
                    selectCity(city.name);
                  }}
                >
                  {city.name}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
