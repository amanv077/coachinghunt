"use client";

import { useEffect, useRef } from "react";

export function BlogViewTracker({ postId }) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    fetch(`/api/blog/${postId}/view`, { method: "POST" })
      .catch((err) => console.error("Failed to track view:", err));
  }, [postId]);

  return null;
}
