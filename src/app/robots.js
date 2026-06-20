const APP_URL = process.env.APP_URL || "http://localhost:3000";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/coaching/dashboard", "/coaching/profile", "/student/"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
