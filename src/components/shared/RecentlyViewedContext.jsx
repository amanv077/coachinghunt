"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "coachinghunt_recently_viewed";
const MAX_ITEMS = 8;

const RecentlyViewedContext = createContext(null);

export function RecentlyViewedProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.slice(0, MAX_ITEMS));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo(
    () => ({
      items,
      addRecentlyViewed(coaching) {
        if (!coaching?.id) return;
        setItems((prev) => {
          const next = [
            {
              id: coaching.id,
              slug: coaching.slug,
              name: coaching.name,
              city: coaching.city,
              logoUrl: coaching.logoUrl,
              avgRating: coaching.avgRating,
            },
            ...prev.filter((item) => item.id !== coaching.id),
          ];
          return next.slice(0, MAX_ITEMS);
        });
      },
    }),
    [items]
  );

  return (
    <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return ctx;
}
