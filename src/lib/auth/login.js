import { getDashboardPath } from "@/lib/auth/dashboard";

export function getLoginHref(returnTo) {
  if (!returnTo) return "/login";
  return `/login?callbackUrl=${encodeURIComponent(returnTo)}`;
}

export function getPostLoginDestination(callbackUrl, role) {
  if (
    callbackUrl &&
    callbackUrl.startsWith("/") &&
    !callbackUrl.startsWith("//") &&
    !callbackUrl.startsWith("/login")
  ) {
    return callbackUrl;
  }
  return getDashboardPath(role) || "/";
}

export function getLoginCallbackFromSearchParams(searchParams) {
  return searchParams.get("callbackUrl") || searchParams.get("redirect");
}

export function redirectAfterLogin(destination) {
  if (typeof window === "undefined") return;
  window.location.replace(destination);
}
