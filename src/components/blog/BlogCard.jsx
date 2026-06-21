import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatBlogDate, estimateReadTime, getPostSummary } from "@/lib/utils/blog";
import { cn } from "@/lib/utils/cn";

function CalendarIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ArticleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h10" />
    </svg>
  );
}

export function BlogCard({ post, hrefPrefix = "/blog" }) {
  const publishedLabel = formatBlogDate(post.publishedAt);
  const readTime = estimateReadTime(post.content);
  const summary = getPostSummary(post);
  const href = `${hrefPrefix}/${post.slug}`;

  return (
    <Link href={href} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-secondary/30 hover:shadow-md">
        <div className="relative h-44 sm:h-48">
          {post.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImageUrl}
              alt=""
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary-light via-white to-surface-muted">
              <ArticleIcon className="h-12 w-12 text-secondary/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          {publishedLabel && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
              <CalendarIcon className="h-3.5 w-3.5 text-secondary" />
              {publishedLabel}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          {post.tags?.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="primary">{tag}</Badge>
              ))}
            </div>
          )}

          <h2 className="text-lg font-semibold leading-snug text-foreground transition group-hover:text-secondary">
            {post.title}
          </h2>

          {summary && (
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
              {summary}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5 text-secondary" />
              {readTime} min read
            </span>
            <span className={cn("font-medium text-secondary transition", "md:opacity-70 md:group-hover:opacity-100")}>
              Read article →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
