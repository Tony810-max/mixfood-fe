import { useUiText } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

type BrandTone = "light" | "dark";

interface BrandMarkProps {
  className?: string;
  /** `light` sits on ivory (basil tile). `dark` sits on basil (ivory tile). */
  tone?: BrandTone;
  /** Decorative by default; pass a label when the mark stands alone. */
  title?: string;
}

/**
 * Monogram: a geometric "M" cut into a basil tile with a brass leaf.
 * Inline SVG, token colours only, no raster.
 */
export function BrandMark({ className, tone = "light", title }: BrandMarkProps) {
  const onDark = tone === "dark";
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-10 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <rect width="40" height="40" rx="11" className={onDark ? "fill-primary-foreground" : "fill-primary"} />
      <rect x="2.5" y="2.5" width="35" height="35" rx="8.5" fill="none" strokeWidth="0.75" className="stroke-brass" />
      <path
        d="M11.5 28.5V14.5L20 24L28.5 14.5V28.5"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={onDark ? "stroke-primary" : "stroke-primary-foreground"}
      />
      <path d="M26.5 6.5C22.6 6.9 20.4 9.2 20.4 12.4C24.2 12 26.5 9.8 26.5 6.5Z" className="fill-brass" />
    </svg>
  );
}

interface BrandLockupProps {
  className?: string;
  tone?: BrandTone;
  /** Hide the small descriptor under the wordmark (compact contexts). */
  compact?: boolean;
}

/** Mark + wordmark. Wordmark is real text so the link keeps an accessible name. */
export function BrandLockup({ className, tone = "light", compact = false }: BrandLockupProps) {
  const ui = useUiText();
  const onDark = tone === "dark";
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <BrandMark tone={tone} className="size-10 md:size-11" />
      <span className="flex flex-col leading-none">
        <span className={cn("font-serif text-xl font-semibold tracking-tight md:text-2xl", onDark ? "text-primary-foreground" : "text-foreground")}>
          Mix Food
        </span>
        {!compact && (
          <span className={cn("mt-1 hidden text-[0.625rem] font-semibold uppercase tracking-[0.22em] sm:block", onDark ? "text-primary-foreground/75" : "text-brass-strong")}>
            {ui("Thai kitchen")}
          </span>
        )}
      </span>
    </span>
  );
}

export default BrandMark;
