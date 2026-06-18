import { cn } from "@/lib/utils/cn";

export function Loader({ fullPage = false, className }) {
  const spinner = (
    <div
      className={cn(
        "h-8 w-8 rounded-full border-4 border-secondary/20 border-t-secondary spinner",
        className
      )}
    />
  );

  if (fullPage) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">{spinner}</div>
    );
  }

  return spinner;
}
