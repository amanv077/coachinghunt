"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

function formatCommentDate(dateString) {
  const d = new Date(dateString);
  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function BlogComments({ postId }) {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetch(`/api/blog/${postId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setComments(data.data);
        } else {
          addToast(data.message || "Failed to load comments", "error");
        }
      })
      .catch(() => addToast("Failed to load comments", "error"))
      .finally(() => setLoading(false));
  }, [postId, addToast]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/blog/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.success) {
        setComments([data.data, ...comments]);
        setContent("");
        addToast("Comment posted!", "success");
      } else {
        addToast(data.message || "Failed to post comment", "error");
      }
    } catch (err) {
      addToast("Failed to post comment", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId) {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setDeletingId(commentId);
    try {
      const res = await fetch(`/api/blog-comments/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setComments(comments.filter((c) => c.id !== commentId));
        addToast("Comment deleted", "success");
      } else {
        addToast(data.message || "Failed to delete comment", "error");
      }
    } catch (err) {
      addToast("Failed to delete comment", "error");
    } finally {
      setDeletingId(null);
    }
  }

  function getUserInitials(name) {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function getRoleBadge(role) {
    if (role === "ADMIN") {
      return (
        <span className="rounded bg-violet-50 px-1.5 py-0.5 text-2xs font-semibold text-violet-700 border border-violet-200">
          Admin
        </span>
      );
    }
    if (role === "COACHING") {
      return (
        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-2xs font-semibold text-blue-700 border border-blue-200">
          Coaching
        </span>
      );
    }
    return null;
  }

  const loginRedirectUrl = typeof window !== "undefined"
    ? `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`
    : "/login";

  return (
    <div className="mt-10 border-t border-border pt-8">
      <h3 className="text-xl font-bold text-foreground">Comments ({comments.length})</h3>

      <div className="mt-5">
        {session ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              placeholder="Write a comment..."
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
              required
            />
            <div className="flex justify-end">
              <Button type="submit" loading={submitting} disabled={!content.trim()} className="px-5 py-2">
                Post Comment
              </Button>
            </div>
          </form>
        ) : (
          <div className="rounded-xl border border-secondary/10 bg-secondary-light/20 p-5 text-center">
            <p className="text-sm text-muted">You must be logged in to comment.</p>
            <a
              href={loginRedirectUrl}
              className="mt-3 inline-flex min-h-9 items-center justify-center rounded-lg bg-secondary px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-secondary-hover transition-colors"
            >
              Sign In to Comment
            </a>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-5">
        {loading ? (
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 animate-pulse">
              <div className="h-9 w-9 rounded-full bg-surface-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-surface-muted" />
                <div className="h-3 w-full rounded bg-surface-muted" />
              </div>
            </div>
            <div className="flex items-start gap-3 animate-pulse">
              <div className="h-9 w-9 rounded-full bg-surface-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 rounded bg-surface-muted" />
                <div className="h-3 w-4/5 rounded bg-surface-muted" />
              </div>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center py-6 text-sm text-muted">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => {
            const canDelete = session && (session.user.id === comment.userId || session.user.role === "ADMIN");
            const isDeleting = deletingId === comment.id;

            return (
              <div key={comment.id} className="flex gap-3 group items-start rounded-xl p-3 hover:bg-surface-muted/30 transition">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-light/40 text-sm font-semibold text-secondary">
                  {getUserInitials(comment.user?.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {comment.user?.name || "Anonymous"}
                    </span>
                    {getRoleBadge(comment.user?.role)}
                    <span className="text-2xs text-muted font-medium">
                      {formatCommentDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted/95 whitespace-pre-line break-words leading-relaxed">
                    {comment.content}
                  </p>
                </div>

                {canDelete && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={isDeleting}
                    className="opacity-0 group-hover:opacity-100 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted hover:text-danger hover:bg-red-50 disabled:opacity-50 transition cursor-pointer self-start"
                    aria-label="Delete comment"
                  >
                    {isDeleting ? (
                      <span className="h-3 w-3 rounded-full border border-current border-t-transparent animate-spin" />
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
