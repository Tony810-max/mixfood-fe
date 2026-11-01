import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteCopy } from "@/components/brand/copy";
import { CountUp, EASE_MIX, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/const";
import tomYum from "@/assets/hero-dish.jpg";
import padThai from "@/assets/pad-thai.jpg";
import somTam from "@/assets/som-tum.jpg";
import mangoRice from "@/assets/mango-sticky-rice.jpg";
import { SectionHeading } from "./SectionHeading";

/** Hover-intent only applies to devices that really hover; touch keeps tap-to-select. */
const canHover = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(hover: hover)").matches;

const ThaiDishHighlight = () => {
  const { t } = useLanguage();
  const copy = useSiteCopy();
  const [active, setActive] = useState(0);
  const dishes = [
    { name: t.specialtyTomYumName, subtitle: t.specialtyTomYumVietnamese, description: t.specialtyTomYumDesc, image: tomYum, href: ROUTES.MENU_ITEMS.TOM_YUM },
    { name: t.specialtyPadThaiName, subtitle: t.specialtyPadThaiVietnamese, description: t.specialtyPadThaiDesc, image: padThai, href: ROUTES.MENU_ITEMS.PAD_THAI },
    { name: t.specialtySomTamName, subtitle: t.specialtySomTamVietnamese, description: t.specialtySomTamDesc, image: somTam, href: ROUTES.MENU_ITEMS.SOM_TAM },
    { name: t.specialtyMangoStickyRiceName, subtitle: t.specialtyMangoStickyRiceVietnamese, description: t.specialtyMangoStickyRiceDesc, image: mangoRice, href: ROUTES.MENU_ITEMS.DESSERTS },
  ];
  const dish = dishes[active];

  return (
    <section id="specialties" aria-labelledby="specialties-title" className="scroll-mt-24 bg-card py-16 md:py-24">
      <div className="page-container">
        <SectionHeading
          titleId="specialties-title"
          eyebrow={copy.kitchenEyebrow}
          title={t.thaiSpecialties}
          description={t.thaiSpecialtiesDesc}
          className="mb-10 md:mb-14"
          action={
            <Button asChild variant="link" className="min-h-11 gap-2 px-0 text-base">
              <Link to={ROUTES.MENU}>
                {t.viewMenu}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          }
        />

        <Reveal className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary shadow-layered lg:aspect-auto lg:min-h-[32rem]">
            <AnimatePresence initial={false}>
              <motion.img
                key={dish.image}
                src={dish.image}
                alt={dish.name}
                width={1024}
                height={768}
                loading="lazy"
                decoding="async"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1, delay: 0.4 } }}
                transition={{ duration: 0.45, ease: EASE_MIX }}
                className="absolute inset-0 size-full object-cover"
              />
            </AnimatePresence>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
            <div aria-live="polite" className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground sm:p-8">
              <p className="eyebrow-on-dark mb-2 tabular-nums">
                <CountUp value={active + 1} pad={2} duration={0.4} />
                {` / ${String(dishes.length).padStart(2, "0")}`}
              </p>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12, ease: EASE_MIX }}
              >
                <h3 className="font-serif text-2xl font-semibold sm:text-3xl">{dish.name}</h3>
                <p className="mt-3 max-w-lg text-sm leading-6 text-primary-foreground/85">{dish.description}</p>
              </motion.div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="border-y border-border" role="group" aria-label={t.thaiSpecialties}>
              <Stagger className="divide-y divide-border" stagger={0.07} y={12}>
                {dishes.map((entry, index) => {
                  const isActive = active === index;
                  const hoverSelect = () => {
                    if (canHover()) setActive(index);
                  };
                  return (
                    <StaggerItem key={entry.href} className="relative">
                      {isActive && (
                        <motion.span
                          aria-hidden="true"
                          layoutId="dish-active-row"
                          className="absolute inset-0 bg-accent/70"
                          transition={{ type: "spring", stiffness: 420, damping: 38 }}
                        />
                      )}
                      <button
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setActive(index)}
                        onMouseEnter={hoverSelect}
                        onFocus={hoverSelect}
                        className={cn(
                          "group relative flex min-h-24 w-full items-center gap-4 px-3 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-5",
                          !isActive && "hover:bg-secondary/60",
                        )}
                      >
                        <span className="size-14 shrink-0 overflow-hidden rounded-xl bg-secondary sm:size-16">
                          <img src={entry.image} alt="" width={64} height={64} loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                        </span>
                        <span className="min-w-0 flex-1 transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-safe:group-hover:translate-x-1">
                          <span className={cn("block font-serif text-lg font-semibold leading-snug sm:text-xl", isActive ? "text-primary" : "text-foreground")}>{entry.name}</span>
                          <span className="mt-1 block text-sm text-muted-foreground">{entry.subtitle}</span>
                        </span>
                        <span className={cn("text-sm tabular-nums", isActive ? "font-semibold text-brass-strong" : "text-muted-foreground")}>{`0${index + 1}`}</span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className={cn(
                            "size-5 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:rotate-12",
                            isActive ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                      </button>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
            <Button asChild size="lg" className="mt-6 w-full sm:w-auto sm:self-start">
              <Link to={`${ROUTES.MENU}?q=${encodeURIComponent(dish.name)}`}>
                {copy.exploreDish}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ThaiDishHighlight;
