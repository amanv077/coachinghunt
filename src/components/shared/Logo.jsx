import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const sizeStyles = {
  sm: "text-[15px]",
  md: "text-[17px] sm:text-lg",
  lg: "text-2xl sm:text-[1.75rem]",
};

export function Logo({ href = "/", size = "md", showWordmark = true, variant = "default", className }) {
  const textSize = sizeStyles[size] ?? sizeStyles.md;
  const isLight = variant === "light";

  if (!showWordmark) return null;

  const content = (
    <span className={cn("inline-flex items-baseline leading-none", textSize)}>
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
  );

  const classes = cn(
    "inline-flex items-center transition-opacity hover:opacity-85",
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
