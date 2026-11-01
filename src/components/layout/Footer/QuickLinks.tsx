import { useSiteCopy } from "@/components/brand/copy";
import { useLanguage } from "@/contexts/LanguageContext";
import { ROUTES } from "@/utils/const";
import { FooterLink } from './FooterLink';

const QuickLinks = () => {
  const { t } = useLanguage();
  const copy = useSiteCopy();

  const quickLinks = [
    { label: t.home, href: ROUTES.HOME },
    { label: t.menu, href: ROUTES.MENU },
    { label: t.reserveTable, href: ROUTES.RESERVE },
    { label: copy.careers, href: ROUTES.CAREERS },
    { label: t.footerAboutUs, href: ROUTES.ABOUT },
    { label: t.footerContactUs, href: ROUTES.CONTACT },
  ];

  return (
    <nav aria-labelledby="footer-quick-links" className="space-y-3">
      <h2 id="footer-quick-links" className="eyebrow-on-dark">{t.footerQuickLinks}</h2>
      <ul>
        {quickLinks.map((link) => (
          <li key={link.href}>
            <FooterLink to={link.href}>{link.label}</FooterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default QuickLinks;
