import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, useUiText } from "@/contexts/LanguageContext";
import { ROUTES } from "@/utils/const";
import { INFORMATION_RESTAURANT } from "@/utils/const";
import { MotionConfig, motion } from "framer-motion";
import { CalendarCheck, CheckCircle2, ClipboardList, Phone, UtensilsCrossed } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { parseBookingDate, readBookingSummary } from "@/pages/Booking/utils/bookingSummary";

const EASE = [0.2, 0.8, 0.2, 1] as [number, number, number, number];

const BookingSuccess = () => {
  const { t } = useLanguage();
  const ui = useUiText();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const summary = readBookingSummary(location.state);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the confirmation so screen-reader users hear it right away.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const formattedDate = summary
    ? new Intl.DateTimeFormat(t.locale, { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(parseBookingDate(summary.date))
    : null;

  const summaryRows = summary && formattedDate
    ? [
        { label: t.fullName, value: summary.name },
        { label: t.phoneNumber, value: summary.phone },
        { label: ui("Date"), value: formattedDate },
        { label: t.bookingTime, value: summary.time },
        { label: ui("Guests"), value: String(summary.guests) },
        ...(summary.note ? [{ label: ui("Notes"), value: summary.note }] : []),
      ]
    : [];

  return (
    <MotionConfig reducedMotion="never">
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 pb-14 pt-24 md:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="w-full max-w-lg"
          >
            <div className="relative rounded-2xl border border-border/80 bg-card p-6 text-center shadow-layered sm:p-9">
              <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-brass/70" />

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.45, ease: EASE }}
                className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success ring-1 ring-success/30"
              >
                <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
              </motion.div>

              <h1
                ref={headingRef}
                tabIndex={-1}
                className="font-serif text-2xl font-semibold text-balance text-foreground focus:outline-none sm:text-3xl"
              >
                {t.bookingSuccessTitle}
              </h1>
              <p role="status" className="mx-auto mt-3 max-w-sm leading-relaxed text-muted-foreground">
                {t.bookingSuccessMessage}
              </p>

              {summaryRows.length > 0 && (
                <section aria-labelledby="booking-summary-title" className="mt-7 rounded-xl border border-border/80 bg-secondary/40 p-4 text-left sm:p-5">
                  <h2 id="booking-summary-title" className="flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.18em] text-brass-strong">
                    <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                    {ui("Reservation summary")}
                  </h2>
                  <dl className="mt-3 divide-y divide-border/70 text-sm">
                    {summaryRows.map((row) => (
                      <div key={row.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 py-2.5 first:pt-0 last:pb-0">
                        <dt className="text-muted-foreground">{row.label}</dt>
                        <dd className="break-words [overflow-wrap:anywhere] font-medium tabular-nums text-foreground">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              <div className="mt-7 flex flex-col gap-3">
                <Button asChild size="lg" className="w-full active:scale-[0.98]">
                  <Link to={ROUTES.HOME}>{t.bookingReturnHome}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full active:scale-[0.98]">
                  <Link to={ROUTES.MENU}>
                    <UtensilsCrossed aria-hidden="true" />
                    {t.bookingViewMenu}
                  </Link>
                </Button>
                {isAuthenticated && (
                  <Button asChild variant="ghost" size="lg" className="w-full">
                    <Link to={`${ROUTES.PROFILE}?section=reservations`}>
                      <ClipboardList aria-hidden="true" />
                      {t.reservationsTitle}
                    </Link>
                  </Button>
                )}
              </div>

              <div className="mt-7 border-t border-border/70 pt-5">
                <p className="text-sm text-muted-foreground">{t.bookingNeedHelp}</p>
                <a
                  href={`tel:${INFORMATION_RESTAURANT.phone.replace(/\s/g, "")}`}
                  className="mt-1 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {t.bookingCallUs} {INFORMATION_RESTAURANT.phone}
                </a>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </MotionConfig>
  );
};

export default BookingSuccess;
