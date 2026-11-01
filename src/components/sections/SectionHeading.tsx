import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  /** Id placed on the heading so the section can use `aria-labelledby`. */
  titleId?: string;
  align?: "left" | "center";
  /** `dark` is for basil (primary) surfaces. */
  tone?: "light" | "dark";
  /** Optional control aligned to the end on wide screens (e.g. "View menu"). */
  action?: ReactNode;
  className?: string;
}

/** Editorial section opener: eyebrow with brass rule, serif heading, optional lead paragraph. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  titleId,
  align = "left",
  tone = "light",
  action,
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  const center = align === "center";

  return (
    <Reveal
      className={cn(
        "flex flex-wrap items-end justify-between gap-x-8 gap-y-5",
        center && "justify-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", center && "mx-auto")}>
        <p className={cn("mb-4 flex items-center gap-3", center && "justify-center", dark ? "eyebrow-on-dark" : "eyebrow")}>
          <span aria-hidden="true" className="brass-rule w-8" />
          {eyebrow}
          {center && <span aria-hidden="true" className="brass-rule w-8" />}
        </p>
        <h2
          id={titleId}
          className={cn(
            "text-balance font-serif text-3xl font-semibold leading-[1.1] md:text-4xl lg:text-5xl",
            dark ? "text-primary-foreground" : "text-foreground",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className={cn("mt-4 max-w-xl text-base leading-7", center && "mx-auto", dark ? "text-primary-foreground/80" : "text-muted-foreground")}>
            {description}
          </p>
        )}
      </div>
      {action}
    </Reveal>
  );
}
