import Link from "next/link";

export function SectionHeader({ title, href, linkLabel = "View all" }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4 border-b border-border pb-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-sm font-medium text-secondary transition hover:underline"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
