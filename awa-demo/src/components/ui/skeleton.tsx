import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-zinc-200/70 dark:bg-blue-950/50 border border-transparent dark:border-blue-900/20",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
