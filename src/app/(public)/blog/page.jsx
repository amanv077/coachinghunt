import { listPublishedPosts } from "@/modules/blog/blog.service";
import { BlogCard } from "@/components/blog/BlogCard";
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

      {items.length === 0 ? (
        <Card className="mt-8">
          <p className="text-muted">New articles coming soon.</p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
