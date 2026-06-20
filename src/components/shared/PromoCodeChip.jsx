"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

export function PromoCodeChip({ code }) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!code) return null;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      addToast("Promo code copied", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast("Could not copy code", "error");
    }
  }

  return (
    <button
      type="button"
      onClick={copyCode}
      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-dashed border-secondary/40 bg-secondary-light/30 px-3 py-2 text-left text-sm transition hover:border-secondary"
    >
      <Badge variant="primary">Promo</Badge>
      <span className="font-mono font-semibold text-secondary">{code}</span>
      <span className="text-xs text-muted">{copied ? "Copied!" : "Tap to copy"}</span>
    </button>
  );
}
