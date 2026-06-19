"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";

export function SaveCoachingButton({ coachingId, initialSaved = false, className }) {
  const { addToast } = useToast();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  async function toggleSave(e) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    try {
      const res = await fetch(`/api/saved-coachings/${coachingId}`, {
        method: saved ? "DELETE" : "POST",
      });
      const data = await res.json();

      if (!data.success) {
        if (res.status === 401 || res.status === 403) {
          addToast("Sign in as a student to save coachings", "error");
        } else {
          addToast(data.message || "Could not update saved list", "error");
        }
        return;
      }

      setSaved(!saved);
      addToast(saved ? "Removed from saved" : "Saved to your list", "success");
    } catch {
      addToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleSave}
      disabled={loading}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border bg-white/95 shadow-sm transition hover:scale-105",
        saved ? "border-danger text-danger" : "border-border text-muted hover:text-danger",
        className
      )}
      aria-label={saved ? "Remove from saved" : "Save coaching"}
    >
      <svg className="h-5 w-5" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}
