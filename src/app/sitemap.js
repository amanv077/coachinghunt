import { prisma } from "@/lib/db/prisma";
import { KNOWN_EXAMS, examToSlug } from "@/lib/seo/constants";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

export default async function sitemap() {
  const [coachings, courses, blogPosts, cityExamRows] = await Promise.all([
    prisma.coachingProfile.findMany({
      where: { listingStatus: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.course.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, postType: true, updatedAt: true },
    }),
    prisma.coachingProfile.findMany({
      where: { listingStatus: "ACTIVE", city: { not: null } },
      select: { city: true, targetExams: true },
    }),
  ]);

  const staticPages = ["", "about", "search", "contact", "privacy", "terms", "blog", "success-stories", "exams"].map(
    (path) => ({
      url: `${APP_URL}/${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1 : 0.7,
    })
  );

  const examPages = KNOWN_EXAMS.map((exam) => ({
    url: `${APP_URL}/exams/${examToSlug(exam)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const cityExamSet = new Set();
  cityExamRows.forEach((row) => {
    row.targetExams.forEach((exam) => {
      if (row.city) {
        cityExamSet.add(`${examToSlug(exam)}-coaching-in-${row.city.toLowerCase().replace(/\s+/g, "-")}`);
      }
    });
  });

  const cityExamPages = [...cityExamSet].map((slug) => ({
    url: `${APP_URL}/coaching-in/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [
    ...staticPages,
    ...examPages,
    ...cityExamPages,
    ...coachings.map((c) => ({
      url: `${APP_URL}/coaching/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.9,
    })),
    ...courses.map((c) => ({
      url: `${APP_URL}/courses/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    ...blogPosts.map((p) => ({
      url: `${APP_URL}/${p.postType === "SUCCESS_STORY" ? "success-stories" : "blog"}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
  ];
}
