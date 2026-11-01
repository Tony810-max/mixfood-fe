import { useLanguage } from "@/contexts/LanguageContext";
import { THAI_DISHES } from "@/utils/const";
import { Link } from "react-router-dom";

interface DishListProps {
  /** The duplicate copy only exists to make the loop seamless: hidden from AT and not focusable. */
  duplicate?: boolean;
}

const DishList = ({ duplicate = false }: DishListProps) => (
  <ul
    aria-hidden={duplicate ? true : undefined}
    className={
      duplicate
        ? "flex shrink-0 items-center motion-reduce:hidden"
        : "flex shrink-0 items-center motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-1"
    }
  >
    {THAI_DISHES.map((dish) => (
      <li key={dish.href} className="flex items-center motion-reduce:last:[&>span]:hidden">
        <Link
          to={dish.href}
          tabIndex={duplicate ? -1 : undefined}
          className="inline-flex min-h-11 items-center rounded-sm px-1 font-serif text-base italic text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {dish.name}
        </Link>
        <span aria-hidden="true" className="mx-6 size-1.5 shrink-0 rotate-45 bg-brass" />
      </li>
    ))}
  </ul>
);

/**
 * Slow marquee of the existing signature dishes (same list and links as the footer).
 * Pauses on hover and keyboard focus; with reduced motion it is a static, wrapping list.
 */
export const DishMarquee = () => {
  const { t } = useLanguage();

  return (
    <nav aria-label={t.footerSpecialtyDishes} className="group/marquee border-t border-border/70">
      <div className="marquee-mask overflow-hidden motion-reduce:[mask-image:none] motion-reduce:[-webkit-mask-image:none]">
        <div className="flex w-max motion-safe:animate-marquee motion-safe:group-focus-within/marquee:[animation-play-state:paused] motion-safe:group-hover/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:justify-center">
          <DishList />
          <DishList duplicate />
        </div>
      </div>
    </nav>
  );
};
