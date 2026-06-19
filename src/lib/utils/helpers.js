export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateBookingCode() {
  return `BK-${Date.now().toString(36).toUpperCase()}`;
}

export function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function formatDemoDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function getRelativeDateLabel(date) {
  const today = startOfToday();
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `in ${diffDays} days`;
  if (diffDays === -1) return "Yesterday";
  return `${Math.abs(diffDays)} days ago`;
}

export function buildSearchHref({ targetExam, targetExams, city } = {}) {
  const params = new URLSearchParams();
  const exam = targetExam || targetExams?.[0];
  if (exam) params.set("targetExam", exam);
  if (city) params.set("city", city);
  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}
