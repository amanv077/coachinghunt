import { EXAMS } from "@/lib/data/exams";

/**
 * Parent category → concrete exam tags used on coaching profiles.
 * Homepage / search chips use short labels (NEET, JEE); seed & live data
 * often store variants (NEET UG, JEE Main).
 */
export const EXAM_FAMILY = {
  JEE: ["JEE", "JEE Main", "JEE Advanced", "IIT-JEE", "IIT JEE", "BITSAT", "VITEEE", "WBJEE", "MHT-CET"],
  NEET: ["NEET", "NEET UG", "NEET PG", "AIIMS"],
  Boards: ["Boards", "Class 10 Boards", "Class 12 Boards", "CBSE", "Board"],
  Foundation: ["Foundation", "Olympiad", "NTSE", "KVPY"],
  UPSC: ["UPSC", "UPSC Civil Services", "UPSC CDS", "UPSC NDA"],
  CA: ["CA", "CA Foundation", "CA Intermediate", "CS Executive", "CMA Foundation"],
  CLAT: ["CLAT", "AILET"],
};

/**
 * Expand a filter value into all DB tags that should match.
 * "NEET" → ["NEET", "NEET UG", "NEET PG", "AIIMS"]
 */
export function expandExamFilterValues(exam) {
  if (!exam || typeof exam !== "string") return [];
  const trimmed = exam.trim();
  if (!trimmed) return [];

  const lower = trimmed.toLowerCase();

  const parentKey = Object.keys(EXAM_FAMILY).find((key) => key.toLowerCase() === lower);
  if (parentKey) {
    return unique([parentKey, ...EXAM_FAMILY[parentKey]]);
  }

  for (const aliases of Object.values(EXAM_FAMILY)) {
    const match = aliases.find((a) => a.toLowerCase() === lower);
    if (match) return [match];
  }

  const catalog = EXAMS.find((e) => e.toLowerCase() === lower);
  if (catalog) return [catalog];

  return [trimmed];
}

/** Whether a coaching's targetExams entry belongs to a parent category. */
export function examBelongsToCategory(examTag, category) {
  if (!examTag || !category) return false;
  const values = expandExamFilterValues(category);
  const lower = examTag.toLowerCase();
  if (values.some((v) => v.toLowerCase() === lower)) return true;
  return lower === category.toLowerCase() || lower.startsWith(`${category.toLowerCase()} `);
}

export function countCoachingsForCategory(coachings, category) {
  return coachings.filter((c) =>
    (c.targetExams || []).some((tag) => examBelongsToCategory(tag, category))
  ).length;
}

/** Normalize URL slug / query exam into the canonical DB label when possible. */
export function resolveExamLabel(raw) {
  if (!raw) return raw;
  const normalized = String(raw).replace(/-/g, " ").trim();
  const lower = normalized.toLowerCase();

  const parentKey = Object.keys(EXAM_FAMILY).find((key) => key.toLowerCase() === lower);
  if (parentKey) return parentKey;

  for (const aliases of Object.values(EXAM_FAMILY)) {
    const match = aliases.find((a) => a.toLowerCase() === lower);
    if (match) return match;
  }

  const catalog = EXAMS.find((e) => e.toLowerCase() === lower);
  if (catalog) return catalog;

  return normalized
    .split(/\s+/)
    .map((part) => {
      if (part.length <= 3) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ");
}

function unique(arr) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}
