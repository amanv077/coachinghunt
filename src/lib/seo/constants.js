import { resolveExamLabel } from "@/lib/seo/exam-match";

export const KNOWN_EXAMS = ["JEE", "NEET", "Boards", "Foundation", "UPSC", "CA", "CLAT"];

export function examToSlug(exam) {
  return exam.toLowerCase().replace(/\s+/g, "-");
}

export function slugToExam(slug) {
  return resolveExamLabel(slug);
}

export function cityToSlug(city) {
  return city.toLowerCase().replace(/\s+/g, "-");
}

export function slugToCity(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildCityExamSlug(exam, city) {
  return `${examToSlug(exam)}-coaching-in-${cityToSlug(city)}`;
}

export function parseCityExamSlug(slug) {
  const match = slug.match(/^(.+)-coaching-in-(.+)$/);
  if (!match) return null;
  return {
    exam: slugToExam(match[1]),
    city: slugToCity(match[2]),
  };
}
