import { useUiText } from '@/contexts/LanguageContext';
import { useLanguage } from "@/contexts/LanguageContext";
import { BrandMark } from "@/components/brand/BrandMark";
import { useSiteCopy } from "@/components/brand/copy";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/utils/const";
import { Home, UtensilsCrossed } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const ui = useUiText();
  const location = useLocation();
  const { t } = useLanguage();
  const copy = useSiteCopy();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center pt-16 md:pt-20">
        <div className="page-container py-16 md:py-24">
          <Stagger onMount stagger={0.08} className="mx-auto flex max-w-xl flex-col items-center text-center">
            <StaggerItem>
              <BrandMark className="size-16" />
            </StaggerItem>
            <StaggerItem>
              <p aria-hidden="true" className="mt-6 font-serif text-[clamp(5rem,22vw,9rem)] font-semibold italic leading-none text-primary">
                {t.notFoundTitle}
              </p>
            </StaggerItem>
            <StaggerItem>
              <span aria-hidden="true" className="brass-ornament mx-auto mt-4" />
            </StaggerItem>
            <StaggerItem>
              <h1 className="mt-6 text-balance font-serif text-3xl font-semibold md:text-4xl">{t.notFoundMessage}</h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
                {ui("The page you're looking for doesn't exist or has been moved.")} {copy.notFoundHint}
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg">
                  <Link to={ROUTES.HOME}>
                    <Home aria-hidden="true" />
                    {t.notFoundReturn}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to={ROUTES.MENU}>
                    <UtensilsCrossed aria-hidden="true" />
                    {t.viewMenu}
                  </Link>
                </Button>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
