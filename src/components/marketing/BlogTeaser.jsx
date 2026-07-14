import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function BlogTeaser({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section className="border-y border-border bg-surface-muted/40 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-secondary">
              Guides & stories
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Latest from CoachingHunt
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted">
              Tips for choosing a coaching, demo day prep, and student success stories.
            </p>
          </div>
          <Link href="/blog" className="shrink-0">
            <Button variant="secondary" className="min-h-11 w-full font-semibold sm:w-auto">
              View all posts
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const href =
              post.postType === "SUCCESS_STORY"
                ? `/success-stories/${post.slug}`
                : `/blog/${post.slug}`;
            return (
              <Link
                key={post.id}
                href={href}
                className="group flex min-h-[140px] flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-secondary/30 hover:shadow-md"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                  {post.postType === "SUCCESS_STORY" ? "Success story" : "Blog"}
                </span>
                <h3 className="mt-2 line-clamp-2 text-base font-bold text-foreground group-hover:text-secondary">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{post.excerpt}</p>
                )}
                <span className="mt-4 text-xs font-semibold text-secondary">
                  Read more →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
