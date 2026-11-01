import * as React from "react";
import { TriangleAlert, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ErrorStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: LucideIcon;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Recovery control, usually a retry `Button`. */
  action?: React.ReactNode;
  headingLevel?: "h2" | "h3" | "h4";
}

/** Failure surface with a recovery action. Announced immediately via `role="alert"`. */
const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ icon: Icon = TriangleAlert, title, description, action, headingLevel: Heading = "h3", className, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "flex flex-col items-center rounded-2xl border border-destructive/25 bg-card px-5 py-14 text-center shadow-layered md:py-16",
        className,
      )}
      {...props}
    >
      <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <Heading className="font-serif text-xl font-semibold text-foreground md:text-2xl">{title}</Heading>
      {description && <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>}
      {action && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{action}</div>}
    </div>
  ),
);
ErrorState.displayName = "ErrorState";

export { ErrorState };
