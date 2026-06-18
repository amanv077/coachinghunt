import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

function StarIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function MapPinIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export function CoachingCard({ coaching }) {
  const initials = coaching.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const demoCount = coaching.openDemoCount ?? coaching._count?.openDemoSlots ?? 0;

  return (
    <Link href={`/coaching/${coaching.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-secondary/30 hover:shadow-lg">
        <div className="relative h-28 bg-gradient-to-br from-secondary-light to-secondary-muted/40">
          {coaching.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coaching.coverImageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
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
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
            <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-secondary" />
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
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                demoCount > 0 ? "text-success" : "text-muted"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${demoCount > 0 ? "bg-success" : "bg-border"}`}
              />
              {demoCount > 0 ? `${demoCount} demo${demoCount !== 1 ? "s" : ""} available` : "No demos"}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-secondary">
              <StarIcon className="h-4 w-4 text-warning" />
              {coaching.avgRating?.toFixed(1) || "0.0"}
              <span className="font-normal text-muted">({coaching.reviewCount || 0})</span>
            </span>
          </div>
          <p className="mt-3 text-xs font-medium text-secondary opacity-0 transition group-hover:opacity-100">
            View profile →
          </p>
        </div>
      </article>
    </Link>
  );
}
