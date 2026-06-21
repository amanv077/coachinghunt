"use client";

import { useEffect, useState } from "react";

export function BlogReactions({ postId, initialLikes = 0, initialDislikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [activeReaction, setActiveReaction] = useState(null); // 'LIKE', 'DISLIKE', or null
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${postId}/react`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setActiveReaction(data.data.activeReaction);
          setLikes(data.data.likes);
          setDislikes(data.data.dislikes);
        }
      })
      .catch((err) => console.error("Error fetching reaction status:", err));
  }, [postId]);

  async function handleReact(type) {
    if (loading) return;
    setLoading(true);

    const prevReaction = activeReaction;
    const prevLikes = likes;
    const prevDislikes = dislikes;

    if (activeReaction === type) {
      setActiveReaction(null);
      if (type === "LIKE") setLikes((l) => Math.max(0, l - 1));
      else setDislikes((d) => Math.max(0, d - 1));
    } else {
      setActiveReaction(type);
      if (type === "LIKE") {
        setLikes((l) => l + 1);
        if (prevReaction === "DISLIKE") setDislikes((d) => Math.max(0, d - 1));
      } else {
        setDislikes((d) => d + 1);
        if (prevReaction === "LIKE") setLikes((l) => Math.max(0, l - 1));
      }
    }

    try {
      const res = await fetch(`/api/blog/${postId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveReaction(data.data.activeReaction);
        setLikes(data.data.likes);
        setDislikes(data.data.dislikes);
      } else {
        setActiveReaction(prevReaction);
        setLikes(prevLikes);
        setDislikes(prevDislikes);
      }
    } catch (err) {
      setActiveReaction(prevReaction);
      setLikes(prevLikes);
      setDislikes(prevDislikes);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4 py-4 my-2 border-y border-border">
      <span className="text-sm font-semibold text-muted">Was this post helpful?</span>
      
      <button
        onClick={() => handleReact("LIKE")}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-medium transition cursor-pointer ${
          activeReaction === "LIKE"
            ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs"
            : "bg-white border-border text-muted hover:text-foreground hover:bg-surface-muted"
        }`}
        aria-label="Like this post"
      >
        <svg
          className={`h-4.5 w-4.5 ${activeReaction === "LIKE" ? "fill-emerald-600 stroke-emerald-600" : "fill-none"}`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
          />
        </svg>
        <span>{likes}</span>
      </button>

      <button
        onClick={() => handleReact("DISLIKE")}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-medium transition cursor-pointer ${
          activeReaction === "DISLIKE"
            ? "bg-rose-50 border-rose-300 text-rose-700 shadow-xs"
            : "bg-white border-border text-muted hover:text-foreground hover:bg-surface-muted"
        }`}
        aria-label="Dislike this post"
      >
        <svg
          className={`h-4.5 w-4.5 ${activeReaction === "DISLIKE" ? "fill-rose-600 stroke-rose-600" : "fill-none"}`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          transform="scale(1, -1)"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
          />
        </svg>
        <span>{dislikes}</span>
      </button>
    </div>
  );
}
