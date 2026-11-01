import { useSiteCopy } from "@/components/brand/copy";
import LanguageToggle from "@/components/navigation/LanguageToggle";
import { NavLink } from "@/components/navigation/NavLink";
import ReserveButton from "@/components/navigation/ReserveButton";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLogout } from "@/hooks/api/useAuth";
import { ROUTES } from "@/utils/const";
import { Calendar, ChevronDown, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

interface DesktopNavProps {
  navItems: Array<{ label: string; href: string }>;
}

const DesktopNav = ({ navItems }: DesktopNavProps) => {
  const { t } = useLanguage();
  const copy = useSiteCopy();
  const { user, isAuthenticated, setUser } = useAuth();
  const logoutMutation = useLogout();

  return (
    <nav aria-label={copy.mainNavigation} className="hidden items-center gap-6 lg:flex xl:gap-8">
      <ul className="flex items-center gap-6 xl:gap-8">
        {navItems.map((item) => (
          <li key={item.href}>
            <NavLink
              to={item.href}
              end={item.href === ROUTES.HOME}
              className="nav-underline inline-flex min-h-11 items-center rounded-sm font-body text-sm font-medium text-foreground/75 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[current=page]:text-foreground"
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <span aria-hidden="true" className="h-6 w-px bg-border" />

      <LanguageToggle variant="desktop" />

      {/* Auth Section */}
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="max-w-[12rem] gap-2 rounded-xl px-3.5 text-foreground data-[state=open]:border-brass data-[state=open]:bg-accent/60"
            >
              <User className="h-4 w-4 shrink-0" />
              <span className="truncate">{user?.name || t.headerUser}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl border-border bg-popover p-1.5 shadow-layered-hover">
            <DropdownMenuLabel className="rounded-xl bg-secondary/60 px-3 py-2.5 font-normal">
              <div className="flex flex-col space-y-1">
                <p className="truncate text-sm font-semibold leading-none">{user?.name || t.headerUser}</p>
                <p className="truncate text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="min-h-11 rounded-xl focus:bg-accent focus:text-accent-foreground">
              <Link to={ROUTES.PROFILE} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>{t.profileTitle}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="min-h-11 rounded-xl focus:bg-accent focus:text-accent-foreground">
              <Link to={ROUTES.RESERVATIONS} className="cursor-pointer">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{t.reservationsTitle}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setUser(null);
              logoutMutation.mutate();
            }} className="min-h-11 cursor-pointer rounded-xl text-destructive focus:bg-destructive/10 focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t.headerLogout}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-1.5">
          <Button asChild variant="ghost" size="sm">
            <Link to={ROUTES.AUTH.LOGIN}>{t.headerSignIn}</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={ROUTES.AUTH.REGISTER}>{t.headerSignUp}</Link>
          </Button>
        </div>
      )}

      <ReserveButton content={t.reserveTable} className="min-w-0 px-5" />
    </nav>
  );
};

export default DesktopNav;
