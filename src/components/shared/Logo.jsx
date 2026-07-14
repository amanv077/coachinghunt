import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const sizeStyles = {
  sm: { text: "text-[15px]", icon: "h-6 w-6", iconInner: "h-3.5 w-3.5" },
  md: { text: "text-[17px] sm:text-lg", icon: "h-7 w-7", iconInner: "h-4 w-4" },
  lg: { text: "text-2xl sm:text-[1.75rem]", icon: "h-9 w-9", iconInner: "h-5 w-5" },
};

/** Compass/pin monogram used across navbar, auth, and brand panel. */
export function LogoMark({ className, variant = "default", size = "md" }) {
  const isLight = variant === "light";
  const iconBox = sizeStyles[size]?.icon ?? sizeStyles.md.icon;
  const iconInner = sizeStyles[size]?.iconInner ?? sizeStyles.md.iconInner;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg shadow-sm",
        iconBox,
        isLight
          ? "bg-white/15 text-white ring-1 ring-white/20"
          : "bg-secondary text-white shadow-secondary/20",
        className
      )}
      aria-hidden
    >
      <svg className={iconInner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
        <circle cx="11" cy="11" r="2.5" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

export function Logo({
  href = "/",
  size = "md",
  showWordmark = true,
  iconOnly = false,
  variant = "default",
  className,
}) {
  const styles = sizeStyles[size] ?? sizeStyles.md;
  const isLight = variant === "light";

  const content = (
    <span className="inline-flex items-center gap-2">
      <LogoMark size={size} variant={variant} />
      {showWordmark && !iconOnly && (
        <span className={cn("inline-flex items-baseline leading-none", styles.text)}>
          <span
            className={cn(
              "font-medium tracking-[-0.03em]",
              isLight ? "text-white/90" : "text-foreground/85"
            )}
          >
            Coaching
          </span>
          <span
            className={cn(
              "font-bold tracking-[-0.03em]",
              isLight
                ? "text-white"
                : "bg-gradient-to-r from-secondary via-secondary to-primary-dark bg-clip-text text-transparent"
            )}
          >
            Hunt
          </span>
        </span>
      )}
    </span>
  );

  const classes = cn("inline-flex items-center transition-opacity hover:opacity-85", className);

  if (href) {
    return (
      <Link href={href} className={classes} aria-label="CoachingHunt home">
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
