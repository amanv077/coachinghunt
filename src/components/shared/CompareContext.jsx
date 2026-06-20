"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "coachinghunt_compare";

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCompareList(parsed.slice(0, 3));
      }
    } catch {
      // ignore invalid storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
  }, [compareList, hydrated]);

  const value = useMemo(() => ({
    compareList,
    addToCompare(coaching) {
      setCompareList((prev) => {
        if (prev.some((item) => item.id === coaching.id)) return prev;
        if (prev.length >= 3) return prev;
        return [...prev, { id: coaching.id, slug: coaching.slug, name: coaching.name, logoUrl: coaching.logoUrl }];
      });
    },
    removeFromCompare(coachingId) {
      setCompareList((prev) => prev.filter((item) => item.id !== coachingId));
    },
    isInCompare(coachingId) {
      return compareList.some((item) => item.id === coachingId);
    },
    clearCompare() {
      setCompareList([]);
    },
  }), [compareList]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
