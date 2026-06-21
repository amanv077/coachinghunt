import { blogExcerpt, isHtmlContent, stripHtml } from "@/lib/utils/html";

export function formatBlogDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function estimateReadTime(content, wordsPerMin = 200) {
  const text = isHtmlContent(content) ? stripHtml(content) : content || "";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMin));
}

export function getPostSummary(post, maxLength = 140) {
  if (post.excerpt?.trim()) return post.excerpt.trim();
  return blogExcerpt(post.content, maxLength);
}

export function buildShareCaption({ title, excerpt, url, tags = [] }) {
  const tagLine = tags.length
    ? tags.map((t) => `#${t.replace(/\s+/g, "")}`).join(" ")
    : "#CoachingHunt #ExamPrep";

  return `${title}\n\n${excerpt || ""}\n\nRead more: ${url}\n\n${tagLine}`.trim();
}
