import { notFound } from "next/navigation";
import { getPostBySlug } from "@/modules/blog/blog.service";
import { buildOgMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.postType !== "SUCCESS_STORY") return { title: "Story Not Found" };
  return buildOgMetadata({
    title: post.title,
    description: post.excerpt || post.content.slice(0, 160),
    image: post.coverImageUrl,
    path: `/success-stories/${slug}`,
  });
}

export default async function SuccessStoryPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.postType !== "SUCCESS_STORY") notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="prose mt-8 whitespace-pre-wrap text-muted">{post.content}</div>
    </article>
  );
}
