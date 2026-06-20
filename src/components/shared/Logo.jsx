import Link from "next/link";
import { cn } from "@/lib/utils/cn";

function LogoMark({ className }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="40" height="40" rx="10" className="fill-secondary" />
      <path
        d="M20 9c-4.97 0-9 3.58-9 8 0 2.76 1.58 5.18 4 6.58V29h10v-5.42c2.42-1.4 4-3.82 4-6.58 0-4.42-4.03-8-9-8z"
        className="fill-white/95"
      />
      <circle cx="20" cy="17" r="3.5" className="fill-secondary" />
      <path
        d="M27 29l4.5 4.5"
        className="stroke-white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="31" cy="33" r="2" className="stroke-white fill-none" strokeWidth="2" />
    </svg>
  );
}

const sizeStyles = {
  sm: { mark: "h-8 w-8", text: "text-base", gap: "gap-2" },
  md: { mark: "h-9 w-9", text: "text-lg", gap: "gap-2.5" },
  lg: { mark: "h-11 w-11", text: "text-xl", gap: "gap-3" },
};

export function Logo({ href = "/", size = "md", showWordmark = true, variant = "default", className }) {
  const styles = sizeStyles[size] ?? sizeStyles.md;
  const isLight = variant === "light";

  const content = (
    <>
      <LogoMark className={cn("shrink-0", styles.mark)} />
      {showWordmark && (
        <span className={cn("font-bold tracking-tight", styles.text)}>
          <span className={isLight ? "text-white" : "text-foreground"}>Coaching</span>
          <span className={isLight ? "text-white/90" : "text-secondary"}>Hunt</span>
        </span>
      )}
    </>
  );

  const classes = cn(
    "inline-flex items-center transition-opacity hover:opacity-90",
    styles.gap,
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label="CoachingHunt home">
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
