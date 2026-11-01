import { BrandLockup } from "@/components/brand/BrandMark";
import { useSiteCopy } from "@/components/brand/copy";
import { useScrolled } from "@/components/motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { ROUTES } from "@/utils/const";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DesktopNav from "./Header/DesktopNav";
import MobileNav from "./Header/MobileNav";

/**
 * Sticky site header. Transparent over the page at the top, solid ivory with a hairline once scrolled.
 * Height contract (h-16 / md:h-20) is relied on by sticky bars and page top padding elsewhere.
 */
const Header = () => {
  const copy = useSiteCopy();
  const scrolled = useScrolled(8);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navItems = [
    { label: t.home, href: ROUTES.HOME },
    { label: t.menu, href: ROUTES.MENU },
    { label: copy.careers, href: ROUTES.CAREERS },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b pt-[env(safe-area-inset-top)] transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        scrolled ? "border-border bg-background shadow-layered" : "border-transparent bg-background/60",
      )}
    >
      <div className="page-container flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          to={ROUTES.HOME}
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={t.ariaHome}
        >
          <BrandLockup />
        </Link>

        <DesktopNav navItems={navItems} />
        <MobileNav navItems={navItems} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </div>
    </header>
  );
};

export default Header;
