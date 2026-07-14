import { Logo } from "@/components/shared/Logo";

export function AuthMobileBrand() {
  return (
    <div className="mb-6 rounded-2xl border border-secondary/15 bg-white p-4 shadow-sm md:hidden">
      <Logo href="/" size="md" />
      <p className="mt-2 text-sm font-medium text-foreground">
        Find &amp; book coaching demos across India
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Verified institutes", "Free for students", "Instant booking"].map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-muted"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}
