import Link from "next/link";
import { listPublishedPosts } from "@/modules/blog/blog.service";
import { Card } from "@/components/ui/Card";
import { buildOgMetadata } from "@/lib/seo/metadata";

export const metadata = buildOgMetadata({
  title: "CoachingHunt Blog",
  description: "Exam tips, coaching guides, and student success stories.",
  path: "/blog",
});

export default async function BlogPage() {
  const { items } = await listPublishedPosts({ postType: "BLOG", limit: 12 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="mt-2 text-muted">Guides and tips for choosing the right coaching.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="h-full transition hover:shadow-md">
              {post.coverImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.coverImageUrl} alt="" className="mb-4 h-40 w-full rounded-lg object-cover" />
              )}
              <p className="font-semibold text-foreground">{post.title}</p>
              {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted">{post.excerpt}</p>}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
