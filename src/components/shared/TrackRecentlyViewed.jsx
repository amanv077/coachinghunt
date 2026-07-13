"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/components/shared/RecentlyViewedContext";

export function TrackRecentlyViewed({ coaching }) {
  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    if (coaching?.id) addRecentlyViewed(coaching);
  }, [coaching, addRecentlyViewed]);

  return null;
}
