import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export function CoachingCard({ coaching }) {
  const initials = coaching.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/coaching/${coaching.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-secondary/30 hover:shadow-lg">
        <div className="relative h-28 bg-gradient-to-br from-secondary-light to-secondary-muted/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(44,76,156,0.15),transparent_60%)]" />
          <div className="absolute bottom-0 left-5 translate-y-1/2">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-lg font-bold text-white shadow-md ring-4 ring-white">
              {coaching.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coaching.logoUrl} alt="" className="h-full w-full rounded-xl object-cover" />
              ) : (
                initials
              )}
            </div>
          </div>
          {coaching.verificationStatus === "VERIFIED" && (
            <Badge variant="success" className="absolute right-4 top-4">
              Verified
            </Badge>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 pt-10">
          <h3 className="font-semibold text-foreground transition group-hover:text-secondary">
            {coaching.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted">
            {coaching.locality}, {coaching.city}
          </p>
          {coaching.tagline && (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
              {coaching.tagline}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {coaching.targetExams?.slice(0, 3).map((exam) => (
              <Badge key={exam} variant="primary">
                {exam}
              </Badge>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs text-muted">{coaching.category}</span>
            <span className="flex items-center gap-1 text-sm font-semibold text-secondary">
              ★ {coaching.avgRating?.toFixed(1) || "0.0"}
              <span className="font-normal text-muted">({coaching.reviewCount || 0})</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
