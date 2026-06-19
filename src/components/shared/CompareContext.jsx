"use client";

import { createContext, useContext, useMemo, useState } from "react";

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

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
