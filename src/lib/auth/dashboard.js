export function getDashboardPath(role) {
  if (role === "STUDENT") return "/student/dashboard";
  if (role === "COACHING") return "/coaching/dashboard";
  if (role === "ADMIN") return "/admin/dashboard";
  return null;
}

export function getProfilePath(role) {
  if (role === "STUDENT") return "/student/profile";
  if (role === "COACHING") return "/coaching/profile";
  return null;
}
