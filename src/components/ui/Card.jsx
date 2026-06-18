import { cn } from "@/lib/utils/cn";

export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white p-5 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
