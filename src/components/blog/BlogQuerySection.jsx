"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export function BlogQuerySection({ blogSlug, blogTitle }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [mounted, setMounted] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setForm({ name: "", email: "", phone: "" });
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted) {
    return (
      <div className="mt-12 rounded-2xl bg-secondary-light/35 border border-secondary/10 p-6 md:p-8 text-center shadow-sm">
        <h3 className="text-xl font-bold text-foreground">Need more details or clarification?</h3>
        <p className="mt-2 text-muted max-w-xl mx-auto text-sm leading-relaxed">
          Preparing for exams or figuring out which coaching fits you best can be challenging. 
          Book a free session with one of our counselors for personalized support.
        </p>
        <button
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-secondary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-secondary-hover transition-colors"
        >
          Book free session
        </button>
      </div>
    );
  }

  if (session) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      addToast("Please fill all the fields", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/blog-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          blogSlug,
          blogTitle,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast("Session booked! We will reach out to you shortly.", "success");
        setOpen(false);
      } else {
        addToast(data.message || "Failed to submit query", "error");
      }
    } catch (err) {
      addToast("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Informative bottom CTA block */}
      <div className="mt-12 rounded-2xl bg-secondary-light/35 border border-secondary/10 p-6 md:p-8 text-center shadow-sm">
        <h3 className="text-xl font-bold text-foreground">Need more details or clarification?</h3>
        <p className="mt-2 text-muted max-w-xl mx-auto text-sm leading-relaxed">
          Preparing for exams or figuring out which coaching fits you best can be challenging. 
          Book a free session with one of our counselors for personalized support.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-secondary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-secondary-hover transition-colors"
        >
          Book free session
        </button>
      </div>

      {/* Modal Popup overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/55 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />

          {/* Modal Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="query-modal-title"
            className="relative z-10 w-full max-w-md rounded-t-2xl border border-border bg-white p-5 shadow-2xl md:rounded-2xl md:p-6"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 id="query-modal-title" className="text-lg font-bold text-foreground">
                  Book a Free Session
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Get personalized advice for your exam preparation journey.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-muted transition"
                aria-label="Close dialog"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />

              <div className="pt-2">
                <Button type="submit" loading={loading} className="min-h-11 w-full text-sm font-semibold">
                  Confirm Booking
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
