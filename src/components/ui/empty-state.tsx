import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Decorative icon shown in a brass-tinted tile. */
  icon?: LucideIcon;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Next-step control, usually a `Button`. */
  action?: React.ReactNode;
  /** Heading level used for the title, to keep the page outline valid. */
  headingLevel?: "h2" | "h3" | "h4";
}

/** "Nothing here yet" surface with a clear next step. Announced politely via `role="status"`. */
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon: Icon, title, description, action, headingLevel: Heading = "h3", className, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/60 px-5 py-14 text-center md:py-16",
        className,
      )}
      {...props}
    >
      {Icon && (
        <span className="mb-5 grid size-14 place-items-center rounded-2xl border border-brass/40 bg-brass/10 text-brass-strong">
          <Icon aria-hidden="true" className="size-6" />
        </span>
      )}
      <Heading className="font-serif text-xl font-semibold text-foreground md:text-2xl">{title}</Heading>
      {description && <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>}
      {action && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{action}</div>}
    </div>
  ),
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
