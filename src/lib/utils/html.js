import DOMPurify from "isomorphic-dompurify";

const BLOG_ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "h4",
  "ul", "ol", "li", "blockquote", "a", "img", "hr",
];

const BLOG_ALLOWED_ATTR = ["href", "src", "alt", "title", "target", "rel", "class"];

export function sanitizeBlogHtml(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: BLOG_ALLOWED_TAGS,
    ALLOWED_ATTR: BLOG_ALLOWED_ATTR,
  });
}

export function stripHtml(html) {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] }).trim();
}

export function isHtmlContent(content) {
  return /<[a-z][\s\S]*>/i.test(content || "");
}

export function blogExcerpt(content, maxLength = 160) {
  const plain = isHtmlContent(content) ? stripHtml(content) : content;
  return plain.slice(0, maxLength);
}
