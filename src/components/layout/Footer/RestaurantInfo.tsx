import { BrandLockup } from "@/components/brand/BrandMark";
import { useLanguage } from "@/contexts/LanguageContext";
import { ROUTES, SOCIAL_LINKS } from "@/utils/const";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const ICONS = { Facebook, Instagram, Twitter } as const;

const RestaurantInfo = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-5">
      <Link
        to={ROUTES.HOME}
        aria-label={t.ariaHome}
        className="inline-block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      >
        <BrandLockup tone="dark" />
      </Link>
      <span className="brass-rule w-12" aria-hidden="true" />
      <p className="max-w-sm text-sm leading-6 text-primary-foreground/80">
        {t.footerAboutText}
      </p>
      <ul className="flex gap-2">
        {SOCIAL_LINKS.map((social) => {
          const Icon = ICONS[social.name as keyof typeof ICONS] ?? Twitter;
          return (
            <li key={social.name}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-11 place-items-center rounded-xl border border-primary-foreground/25 text-primary-foreground/85 transition-[border-color,color,background-color] hover:border-brass hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                aria-label={social.name}
              >
                <Icon className="size-5" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RestaurantInfo;
