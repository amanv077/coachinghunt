import { cn } from "@/lib/utils/cn";

const variants = {
  primary: "bg-secondary text-white hover:bg-secondary-hover shadow-sm",
  secondary: "bg-white text-secondary border border-secondary hover:bg-secondary-light",
  ghost: "bg-transparent text-muted hover:bg-secondary-light hover:text-secondary",
  danger: "bg-danger text-white hover:bg-red-700",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  loading,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent spinner" />
      )}
      {children}
    </button>
  );
}
