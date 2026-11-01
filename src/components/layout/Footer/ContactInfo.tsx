import { useLanguage } from "@/contexts/LanguageContext";
import { INFORMATION_RESTAURANT } from "@/utils/const";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

const linkClass =
  "break-words rounded-sm transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass";

const ContactInfo = () => {
  const { t } = useLanguage();
  const phoneHref = `tel:${INFORMATION_RESTAURANT.phone.replace(/\s/g, "")}`;

  return (
    <div className="space-y-3">
      <h2 className="eyebrow-on-dark">{t.footerContactUs}</h2>
      <address className="space-y-3.5 text-sm not-italic text-primary-foreground/85">
        <p className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-4 shrink-0 text-brass" aria-hidden="true" />
          <span className="break-words">{INFORMATION_RESTAURANT.address}</span>
        </p>
        <p className="flex items-center gap-3">
          <Phone className="size-4 shrink-0 text-brass" aria-hidden="true" />
          <a href={phoneHref} className={`${linkClass} tabular-nums`}>{INFORMATION_RESTAURANT.phone}</a>
        </p>
        <p className="flex items-center gap-3">
          <Mail className="size-4 shrink-0 text-brass" aria-hidden="true" />
          <a href={`mailto:${INFORMATION_RESTAURANT.email}`} className={linkClass}>{INFORMATION_RESTAURANT.email}</a>
        </p>
        <p className="flex items-center gap-3">
          <Clock className="size-4 shrink-0 text-brass" aria-hidden="true" />
          <span className="break-words">{t.hoursValue}</span>
        </p>
      </address>
    </div>
  );
};

export default ContactInfo;
