import { useSiteCopy } from "@/components/brand/copy";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import ReserveButton from "@/components/navigation/ReserveButton";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Button } from "@/components/ui/button";
import { useLanguage, useUiText } from "@/contexts/LanguageContext";
import { INFORMATION_RESTAURANT } from "@/utils/const";
import { Clock, MapPin, Navigation, Phone, type LucideIcon } from "lucide-react";

const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Mix Food ${INFORMATION_RESTAURANT.address}`)}`;

const Location = () => {
  const ui = useUiText();
  const { t } = useLanguage();
  const copy = useSiteCopy();
  const phoneHref = `tel:${INFORMATION_RESTAURANT.phone.replace(/\s/g, "")}`;

  const rows: Array<{ icon: LucideIcon; label: string; value: string; href?: string }> = [
    { icon: MapPin, label: ui("Address"), value: INFORMATION_RESTAURANT.address },
    { icon: Clock, label: t.hours, value: t.hoursValue },
    { icon: Phone, label: ui("Phone"), value: INFORMATION_RESTAURANT.phone, href: phoneHref },
  ];

  return (
    <section id="location" aria-labelledby="location-title" className="scroll-mt-20 bg-secondary/50 py-16 md:py-24">
      <div className="page-container">
        <SectionHeading
          titleId="location-title"
          eyebrow={copy.locationEyebrow}
          title={t.location}
          className="mb-10 md:mb-14"
        />

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <Reveal className="aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary shadow-layered lg:aspect-auto lg:min-h-[26rem]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1917.108723325348!2d108.23610931193348!3d16.054202099999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142177d7ff847cd%3A0x304e7f27b5c56286!2sMix%20Food!5e0!3m2!1svi!2s!4v1774321341710!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={ui("Mix Food Da Nang location")}
              className="size-full"
            />
          </Reveal>

          <div className="flex flex-col justify-center">
            <Stagger as="ul" className="divide-y divide-border rounded-2xl border border-border bg-card shadow-layered" stagger={0.08}>
              {rows.map(({ icon: Icon, label, value, href }) => (
                <StaggerItem as="li" key={label} className="flex items-start gap-4 p-5 sm:p-6">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-brass/40 bg-brass/10 text-brass-strong">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg font-semibold text-foreground">{label}</h3>
                    {href ? (
                      <a href={href} className="mt-1 inline-flex min-h-11 items-center break-words rounded-sm tabular-nums text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-0">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 break-words text-muted-foreground">{value}</p>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.1} className="mt-6 flex flex-wrap gap-3">
              <ReserveButton size="lg" content={t.reserveTable} />
              <Button asChild variant="outline" size="lg">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation aria-hidden="true" />
                  {copy.getDirections}
                </a>
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
