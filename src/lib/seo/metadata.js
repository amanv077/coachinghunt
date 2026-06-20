const APP_URL = process.env.APP_URL || "http://localhost:3000";

export function buildOgMetadata({ title, description, image, path = "" }) {
  const url = `${APP_URL}${path}`;
  const desc = description?.slice(0, 160) || "";
  const images = image ? [{ url: image, width: 1200, height: 630, alt: title }] : [];

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url,
      siteName: process.env.APP_NAME || "CoachingHunt",
      images,
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: desc,
      images: image ? [image] : [],
    },
  };
}
