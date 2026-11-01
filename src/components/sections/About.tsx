import interiorImg from "@/assets/restaurant-interior.jpg";
import { useSiteCopy } from "@/components/brand/copy";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import ReserveButton from "@/components/navigation/ReserveButton";
import { useLanguage, useUiText } from "@/contexts/LanguageContext";
import { SectionHeading } from "./SectionHeading";

/** Basil brand section: the "Balance of Four" story with the four flavours as an editorial list. */
const About = () => {
  const ui = useUiText();
  const { t } = useLanguage();
  const copy = useSiteCopy();
  const flavours = [t.aboutSalt, t.aboutSweet, t.aboutSpicy, t.aboutSour];

  return (
    <section id="about" aria-labelledby="about-title" className="relative scroll-mt-20 overflow-hidden bg-primary py-16 text-primary-foreground md:py-24">
      <div className="page-container">
        <div className="grid grid-cols-1 items-center gap-10 md:gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <Reveal className="relative order-first">
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-2.5 translate-y-2.5 rounded-2xl border border-brass/70"
            />
            <img
              src={interiorImg}
              alt={ui("Mix Food restaurant interior")}
              width={1200}
              height={800}
              loading="lazy"
              decoding="async"
              className="relative aspect-[4/3] w-full rounded-2xl object-cover shadow-layered-hover"
            />
          </Reveal>

          <div>
            <SectionHeading
              titleId="about-title"
              tone="dark"
              eyebrow={copy.storyEyebrow}
              title={t.aboutTitle}
              description={t.aboutText}
            />

            <Stagger as="ul" className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4" stagger={0.07}>
              {flavours.map((flavour, index) => (
                <StaggerItem as="li" key={flavour} className="border-t border-brass/70 pt-3">
                  <span aria-hidden="true" className="block font-serif text-sm tabular-nums text-brass">{`0${index + 1}`}</span>
                  <span className="mt-1 block font-serif text-xl font-semibold text-primary-foreground">{flavour}</span>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.1} className="mt-9">
              <ReserveButton variant="onDark" size="lg" content={t.reserveTable} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
