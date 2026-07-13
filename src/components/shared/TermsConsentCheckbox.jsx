"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function TermsConsentCheckbox({ checked, onChange, className }) {
  return (
    <label className={cn("flex items-start gap-3 text-sm text-muted", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        className="mt-1 h-4 w-4 min-h-4 min-w-4 rounded border-border text-secondary focus:ring-secondary"
      />
      <span>
        I agree to the{" "}
        <Link href="/terms" className="font-medium text-secondary hover:underline" target="_blank">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-medium text-secondary hover:underline" target="_blank">
          Privacy Policy
        </Link>
      </span>
    </label>
  );
}
