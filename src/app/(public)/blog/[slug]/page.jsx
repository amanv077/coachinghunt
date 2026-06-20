import { notFound } from "next/navigation";
import { getPostBySlug } from "@/modules/blog/blog.service";
import { buildOgMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.postType !== "BLOG") return { title: "Post Not Found" };
  return buildOgMetadata({
    title: post.title,
    description: post.excerpt || post.content.slice(0, 160),
    image: post.coverImageUrl,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.postType !== "BLOG") notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {post.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImageUrl} alt="" className="mb-6 h-56 w-full rounded-2xl object-cover sm:h-72" />
      )}
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="mt-2 text-sm text-muted">
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
      </p>
      <div className="prose mt-8 whitespace-pre-wrap text-muted">{post.content}</div>
    </article>
  );
}
