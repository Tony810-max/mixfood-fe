import heroDish from "@/assets/hero-dish.jpg";
import { useSiteCopy } from "@/components/brand/copy";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import ReserveButton from "@/components/navigation/ReserveButton";
import { Button } from "@/components/ui/button";
import { useLanguage, useUiText } from "@/contexts/LanguageContext";
import { INFORMATION_RESTAURANT, ROUTES } from "@/utils/const";
import { ArrowDown, ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { DishMarquee } from "./DishMarquee";

/**
 * Arched dish photograph inside a concentric brass ring (equal gap on every side).
 * Entrance: pure-CSS rise/fade of the figure, then the ring fades in (CSS keyframes always finish, so the
 * final frame never depends on JS animation state or clip-path support). A light scroll parallax moves an
 * oversized inner wrapper so the radius, the overflow clip and the image sharpness are untouched.
 */
const HeroFigure = () => {
  const { t } = useLanguage();
    const figureRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: figureRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-16, 16]);

  return (
    <figure ref={figureRef} className="arch-enter relative mx-auto w-full max-w-md justify-self-center lg:max-w-[28rem]">
      <span aria-hidden="true" className="arch-frame arch-ring-enter pointer-events-none absolute inset-0 border border-brass/60" />
      <div className="p-2.5">
        <div className="arch-shape relative aspect-[4/5] overflow-hidden shadow-layered">
          <motion.div className="absolute inset-x-0 -inset-y-5 will-change-transform" style={{ y: parallaxY }}>
            <img
              src={heroDish}
              alt={t.heroTomYum}
              width={1024}
              height={1024}
              {...{ fetchpriority: "high" }}
              decoding="async"
              className="size-full object-cover"
            />
          </motion.div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/25 to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground sm:p-8">
            <p className="eyebrow-on-dark mb-2">{t.dishSpecialty}</p>
            <p className="font-serif text-2xl font-semibold leading-snug sm:text-3xl">{t.heroTomYum}</p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-primary-foreground/85">{t.heroTomYumDesc}</p>
          </figcaption>
        </div>
      </div>
    </figure>
  );
};

/** Editorial hero: headline and visit details on the left, arched dish photograph on the right. */
const Hero = () => {
  const ui = useUiText();
  const { t } = useLanguage();
  const copy = useSiteCopy();

  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden bg-background pt-16 md:pt-20">
      <div className="page-container relative grid gap-12 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-24">
        <Stagger onMount stagger={0.08} delay={0.05} className="max-w-xl">
          <StaggerItem>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span aria-hidden="true" className="brass-rule w-10 shrink-0" />
              {copy.heroEyebrow}
            </p>
          </StaggerItem>

          <StaggerItem>
            <h1
              id="hero-title"
              className="text-balance font-serif text-[clamp(2.25rem,7.2vw,4.75rem)] font-semibold leading-[1.05] tracking-tight text-foreground"
            >
              {copy.heroLineA}
              <span className="block font-normal italic text-primary">{copy.heroLineB}</span>
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground md:text-lg md:leading-8">{t.heroSub}</p>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={ROUTES.MENU}>
                  {t.viewMenu}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </Button>
              <ReserveButton variant="outline" size="lg" content={t.reserveTable} />
            </div>
          </StaggerItem>

          <StaggerItem>
            <dl className="mt-10 grid gap-5 border-t border-brass/50 pt-6 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-10">
              <div className="flex items-start gap-3">
                <Clock3 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brass-strong" />
                <div>
                  <dt className="eyebrow">{t.hours}</dt>
                  <dd className="mt-1.5 tabular-nums text-foreground">{t.hoursValue}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brass-strong" />
                <div>
                  <dt className="eyebrow">{ui("Address")}</dt>
                  <dd className="mt-1.5 text-foreground">{INFORMATION_RESTAURANT.address}</dd>
                </div>
              </div>
            </dl>
          </StaggerItem>
        </Stagger>

        <HeroFigure />
      </div>

      <Reveal className="relative border-y border-border bg-secondary/50">
        <div className="page-container flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3 text-sm sm:py-4">
          <p className="font-serif italic text-muted-foreground">{copy.heroTagline}</p>
          <a
            href="#specialties"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copy.findFavourite}
            <ArrowDown aria-hidden="true" className="size-3.5" />
          </a>
        </div>
        <DishMarquee />
      </Reveal>
    </section>
  );
};

export default Hero;
