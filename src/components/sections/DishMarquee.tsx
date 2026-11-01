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
    className="flex shrink-0 items-center"
  >
    {THAI_DISHES.map((dish) => (
      <li key={dish.href} className="flex shrink-0 items-center">
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
 * Two equally sized groups keep the loop filled even on wide screens.
 * Keeps moving on hover/focus and across system motion preferences.
 */
export const DishMarquee = () => {
  const { t } = useLanguage();

  return (
    <nav aria-label={t.footerSpecialtyDishes} className="border-t border-border/70">
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track flex w-max">
          {[false, true].map((duplicate) => (
            <div key={String(duplicate)} aria-hidden={duplicate ? true : undefined} className="flex min-w-[100vw] shrink-0 justify-around">
              <DishList duplicate={duplicate} />
              <DishList duplicate />
              <DishList duplicate />
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};
