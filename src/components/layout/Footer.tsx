import { useLanguage } from "@/contexts/LanguageContext";
import { ROUTES } from "@/utils/const";
import { Link } from "react-router-dom";
import ContactInfo from "./Footer/ContactInfo";
import QuickLinks from "./Footer/QuickLinks";
import RestaurantInfo from "./Footer/RestaurantInfo";
import ThaiDishes from "./Footer/ThaiDishes";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-primary text-primary-foreground">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-brass/70" />
      <div className="page-container py-14 md:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1.3fr] lg:gap-12">
          <RestaurantInfo />
          <QuickLinks />
          <ThaiDishes />
          <ContactInfo />
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-primary-foreground/15 pt-6 text-sm text-primary-foreground/75 md:flex-row md:items-center">
          <p>{t.footerCopyright.replace("{year}", String(currentYear))}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <Link to={ROUTES.MENU} className="inline-flex min-h-11 items-center transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass">{t.menu}</Link>
            <Link to={ROUTES.BOOKING} className="inline-flex min-h-11 items-center transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass">{t.reserveTable}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
