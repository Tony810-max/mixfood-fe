import Header from "@/components/layout/Header"
import { useLanguage, useUiText } from "@/contexts/LanguageContext"
import { INFORMATION_RESTAURANT } from "@/utils/const"
import { MotionConfig, motion } from "framer-motion"
import { BookingForm } from "./BookingForm"
import { BookingInfoCards } from "./BookingInfoCards"
import { BookingRules } from "./BookingRules"

const EASE = [0.2, 0.8, 0.2, 1] as [number, number, number, number]

const Booking = () => {
  const { t } = useLanguage()
  const ui = useUiText()

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-16 pt-24 md:pt-32">
          <div className="page-container max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mx-auto mb-8 max-w-2xl text-center md:mb-12"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass-strong">
                {ui("MIX FOOD · DA NANG")}
              </p>
              <h1 className="mt-3 font-serif text-3xl font-semibold text-balance text-foreground md:text-5xl">
                {t.reservePageTitle}
              </h1>
              <span aria-hidden="true" className="mx-auto mt-5 block h-px w-16 bg-brass" />
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                {t.reservePageSub}
              </p>
            </motion.div>

            <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.55, ease: EASE }}
              >
                <BookingForm />
              </motion.div>

              <motion.aside
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.55, ease: EASE }}
                aria-label={t.bookingRulesTitle}
                className="space-y-6 lg:sticky lg:top-28"
              >
                <BookingInfoCards />
                <BookingRules />
                <p className="px-1 text-sm leading-relaxed text-muted-foreground">
                  {t.contactNote}{" "}
                  <a
                    href={`tel:${INFORMATION_RESTAURANT.phone.replace(/\s/g, "")}`}
                    className="inline-flex min-h-11 items-center rounded-md font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {INFORMATION_RESTAURANT.phone}
                  </a>
                </p>
              </motion.aside>
            </div>
          </div>
        </main>
      </div>
    </MotionConfig>
  )
}

export default Booking
