import { cn } from "@/lib/utils";

/** Sand-toned shimmer placeholder. Decorative: pair it with a labelled `role="status"` region. */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn("skeleton-shimmer rounded-md", className)} {...props} />;
}

export { Skeleton };
