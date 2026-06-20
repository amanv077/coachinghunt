import Link from "next/link";
import { listPublishedPosts } from "@/modules/blog/blog.service";
import { Card } from "@/components/ui/Card";
import { buildOgMetadata } from "@/lib/seo/metadata";

export const metadata = buildOgMetadata({
  title: "Student Success Stories",
  description: "Real stories from students who found their coaching through CoachingHunt.",
  path: "/success-stories",
});

export default async function SuccessStoriesPage() {
  const { items } = await listPublishedPosts({ postType: "SUCCESS_STORY", limit: 12 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Student success stories</h1>
      <p className="mt-2 text-muted">Inspiring journeys from students across India.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.length === 0 ? (
          <Card><p className="text-muted">Success stories coming soon.</p></Card>
        ) : (
          items.map((post) => (
            <Link key={post.id} href={`/success-stories/${post.slug}`}>
              <Card className="h-full transition hover:shadow-md">
                <p className="font-semibold text-foreground">{post.title}</p>
                {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted">{post.excerpt}</p>}
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
