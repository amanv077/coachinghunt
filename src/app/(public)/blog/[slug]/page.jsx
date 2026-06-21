import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug } from "@/modules/blog/blog.service";
import { buildOgMetadata } from "@/lib/seo/metadata";
import { BlogContent } from "@/components/blog/BlogContent";
import { SharePost } from "@/components/blog/SharePost";
import { BlogQuerySection } from "@/components/blog/BlogQuerySection";
import { blogExcerpt } from "@/lib/utils/html";
import { formatBlogDate, estimateReadTime, getPostSummary } from "@/lib/utils/blog";
import { Badge } from "@/components/ui/Badge";
import { BlogViewTracker } from "@/components/blog/BlogViewTracker";
import { BlogReactions } from "@/components/blog/BlogReactions";
import { BlogComments } from "@/components/blog/BlogComments";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.postType !== "BLOG") return { title: "Post Not Found" };
  return buildOgMetadata({
    title: post.title,
    description: post.excerpt || blogExcerpt(post.content),
    image: post.coverImageUrl,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.postType !== "BLOG") notFound();

  const publishedLabel = formatBlogDate(post.publishedAt);
  const readTime = estimateReadTime(post.content);
  const summary = getPostSummary(post, 200);
  const shareUrl = `${APP_URL}/blog/${slug}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to blogs
      </Link>

      <article>
        {post.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImageUrl} alt="" className="mb-6 h-56 w-full rounded-2xl object-cover sm:h-80" />
        )}

        {post.tags?.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="primary">{tag}</Badge>
            ))}
          </div>
        )}

        <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">{post.title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          {post.authorName && (
            <>
              <span className="font-semibold text-foreground">By {post.authorName}</span>
              <span aria-hidden>·</span>
            </>
          )}
          {publishedLabel && <time dateTime={new Date(post.publishedAt).toISOString()}>{publishedLabel}</time>}
          {publishedLabel && <span aria-hidden>·</span>}
          <span>{readTime} min read</span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1">
            👁 {post.views} views
          </span>
        </div>

        {summary && (
          <p className="mt-4 text-base leading-relaxed text-muted">{summary}</p>
        )}

        <SharePost
          title={post.title}
          url={shareUrl}
          excerpt={post.excerpt || blogExcerpt(post.content, 200)}
          tags={post.tags || []}
          imageUrl={post.coverImageUrl || ""}
        />

        <BlogContent content={post.content} className="mt-8" />
        <BlogReactions postId={post.id} initialLikes={post.likes} initialDislikes={post.dislikes} />
        <BlogComments postId={post.id} />
        <BlogQuerySection blogSlug={post.slug} blogTitle={post.title} />
        <BlogViewTracker postId={post.id} />
      </article>
    </div>
  );
}
