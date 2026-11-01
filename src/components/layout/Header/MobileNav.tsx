import { BrandLockup } from "@/components/brand/BrandMark";
import { useSiteCopy } from "@/components/brand/copy";
import LanguageToggle from "@/components/navigation/LanguageToggle";
import { NavLink } from "@/components/navigation/NavLink";
import ReserveButton from "@/components/navigation/ReserveButton";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLogout } from "@/hooks/api/useAuth";
import { cn } from "@/lib/utils";
import { INFORMATION_RESTAURANT, ROUTES } from "@/utils/const";
import { Calendar, Home, LogOut, Menu, Phone, User, UserPlus, UtensilsCrossed, X, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface MobileNavProps {
  navItems: Array<{ label: string; href: string }>;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const NAV_ICONS: LucideIcon[] = [Home, UtensilsCrossed, User];

const rowClass =
  "group flex min-h-14 w-full items-center gap-4 rounded-xl border border-transparent px-4 text-left text-base font-medium text-foreground transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Mobile / tablet navigation drawer built on the Radix-backed Sheet, so it gets a focus trap,
 * Escape to close, body scroll lock and focus return to the trigger for free.
 */
const MobileNav = ({ navItems, mobileOpen, setMobileOpen }: MobileNavProps) => {
  const { t } = useLanguage();
  const copy = useSiteCopy();
  const { user, isAuthenticated, setUser } = useAuth();
  const logoutMutation = useLogout();
  const close = () => setMobileOpen(false);

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={mobileOpen ? t.ariaMenuClose : t.ariaMenuOpen}
          className="-mr-2 grid size-11 place-items-center rounded-xl text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 lg:hidden"
        >
          <Menu className="size-6" aria-hidden="true" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        hideClose
        id="mobile-navigation"
        className="flex w-full max-w-sm flex-col gap-0 border-l border-border bg-background p-0 sm:max-w-sm"
      >
        <SheetTitle className="sr-only">{t.ariaMenuOpen}</SheetTitle>
        <SheetDescription className="sr-only">{copy.drawerDescription}</SheetDescription>

        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 pb-3 pt-[max(env(safe-area-inset-top),0.75rem)]">
          <Link to={ROUTES.HOME} onClick={close} aria-label={t.ariaHome} className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <BrandLockup compact />
          </Link>
          <SheetClose
            aria-label={t.ariaMenuClose}
            className="-mr-2 grid size-11 place-items-center rounded-xl text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
          >
            <X className="size-6" aria-hidden="true" />
          </SheetClose>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="eyebrow">{copy.language}</span>
            <LanguageToggle variant="mobile" />
          </div>

          <nav aria-label={copy.mainNavigation}>
            <ul className="space-y-1">
              {navItems.map((item, index) => {
                const Icon = NAV_ICONS[index] ?? Menu;
                return (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      end={item.href === ROUTES.HOME}
                      onClick={close}
                      className={cn(rowClass, "aria-[current=page]:border-brass/50 aria-[current=page]:bg-accent/70")}
                    >
                      <Icon className="size-5 shrink-0 text-brass-strong" aria-hidden="true" />
                      <span className="flex-1">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="my-5 h-px bg-border" />

          {isAuthenticated ? (
            <div className="space-y-1">
              <div className="mb-3 flex items-center gap-3 rounded-xl bg-secondary/70 p-3.5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <User className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-foreground">{user?.name || t.headerUser}</p>
                  <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <Link to={ROUTES.PROFILE} onClick={close} className={rowClass}>
                <User className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span>{t.profileTitle}</span>
              </Link>

              <Link to={ROUTES.RESERVATIONS} onClick={close} className={rowClass}>
                <Calendar className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span>{t.reservationsTitle}</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setUser(null);
                  logoutMutation.mutate();
                  setMobileOpen(false);
                }}
                className={cn(rowClass, "text-destructive hover:bg-destructive/10")}
              >
                <LogOut className="size-5 shrink-0" aria-hidden="true" />
                <span>{t.headerLogout}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <Link to={ROUTES.AUTH.LOGIN} onClick={close} className={rowClass}>
                <User className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span>{t.headerSignIn}</span>
              </Link>
              <Link to={ROUTES.AUTH.REGISTER} onClick={close} className={rowClass}>
                <UserPlus className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span>{t.headerSignUp}</span>
              </Link>
            </div>
          )}
        </div>

        <div className="shrink-0 space-y-3 border-t border-border bg-card px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-4">
          <a
            href={`tel:${INFORMATION_RESTAURANT.phone.replace(/\s/g, "")}`}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Phone className="size-4 text-brass-strong" aria-hidden="true" />
            <span>{t.hotline}</span>
            <span className="font-semibold tabular-nums text-foreground">{INFORMATION_RESTAURANT.phone}</span>
          </a>
          <ReserveButton size="lg" className="w-full" content={t.reserveTable} onClick={close} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
