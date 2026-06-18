import { cn } from "@/lib/utils/cn";

export function Select({ label, error, className, id, children, ...props }) {
  const inputId = id || props.name;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          "w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20",
          error ? "border-danger" : "border-border",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
