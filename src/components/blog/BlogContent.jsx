import { cn } from "@/lib/utils/cn";
import { isHtmlContent, sanitizeBlogHtml } from "@/lib/utils/html";

export function BlogContent({ content, className }) {
  if (isHtmlContent(content)) {
    return (
      <div
        className={cn("blog-content", className)}
        dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(content) }}
      />
    );
  }

  return (
    <div className={cn("blog-content blog-content--plain", className)}>
      {content}
    </div>
  );
}
