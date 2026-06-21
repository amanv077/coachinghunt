import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils/cn";

const sizeStyles = {
  sm: "h-1.5 w-1.5 gap-1",
  md: "h-2 w-2 gap-1.5",
  lg: "h-2.5 w-2.5 gap-2",
};

export function Loader({ fullPage = false, size = "md", className, label }) {
  const dots = (
    <div
      className={cn("loader-dots flex items-end", sizeStyles[size] ?? sizeStyles.md, className)}
      role="status"
      aria-label={label || "Loading"}
    >
      <span className={cn("loader-dot rounded-full bg-secondary", size === "sm" ? "h-1.5 w-1.5" : size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2")} />
      <span className={cn("loader-dot rounded-full bg-secondary", size === "sm" ? "h-1.5 w-1.5" : size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2")} />
      <span className={cn("loader-dot rounded-full bg-secondary", size === "sm" ? "h-1.5 w-1.5" : size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2")} />
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 px-4 py-12">
        <Logo href={null} size="md" />
        {dots}
        <p className="text-center text-sm text-muted">
          {label || "Finding the best coaching for you…"}
        </p>
      </div>
    );
  }

  return dots;
}
