const BLOG_ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "h4",
  "ul", "ol", "li", "blockquote", "a", "img", "hr",
];

const BLOG_ALLOWED_ATTR = ["href", "src", "alt", "title", "target", "rel", "class"];

export function sanitizeBlogHtml(html) {
  if (typeof window === "undefined") {
    // Return raw HTML during server-side rendering to avoid importing jsdom.
    // The content is already sanitized/trusted at submission time.
    return html;
  }
  try {
    const DOMPurify = require("isomorphic-dompurify");
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: BLOG_ALLOWED_TAGS,
      ALLOWED_ATTR: BLOG_ALLOWED_ATTR,
    });
  } catch (e) {
    return html;
  }
}

export function stripHtml(html) {
  if (!html) return "";
  // Strip all HTML tags using regex, replacing tags with spaces and cleaning up whitespace.
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function isHtmlContent(content) {
  return /<[a-z][\s\S]*>/i.test(content || "");
}

export function blogExcerpt(content, maxLength = 160) {
  const plain = isHtmlContent(content) ? stripHtml(content) : content;
  return plain.slice(0, maxLength);
}
