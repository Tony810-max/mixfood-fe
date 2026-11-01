import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type NativeSelectProps = React.ComponentPropsWithoutRef<"select">;

/**
 * Styled native `<select>`: keeps platform pickers (best on mobile) and full label support,
 * while matching the Input look. Pass `id` and a `<label htmlFor>` as with any select.
 */
const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, ...props }, ref) => (
    <span className="relative block w-full">
      <select
        ref={ref}
        className={cn(
          "peer flex min-h-11 w-full appearance-none rounded-xl border border-input bg-card py-2.5 pl-3.5 pr-10 text-base text-foreground shadow-sm ring-offset-background transition-[border-color,box-shadow] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </span>
  ),
);
NativeSelect.displayName = "NativeSelect";

export { NativeSelect };
