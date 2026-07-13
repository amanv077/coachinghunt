"use client";

import { RecentlyViewedStrip } from "@/components/student/RecentlyViewedStrip";
import { useRecentlyViewed } from "@/components/shared/RecentlyViewedContext";

export function StudentRecentlyViewedSection({ title }) {
  const { items } = useRecentlyViewed();
  return <RecentlyViewedStrip items={items} title={title} />;
}
