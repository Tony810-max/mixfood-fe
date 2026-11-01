import { useLanguage } from "@/contexts/LanguageContext"
import { getBookingRules } from "./utils/const"

export const BookingRules = () => {
  const { t } = useLanguage()
  const bookingRules = getBookingRules(t)

  return (
    <section aria-labelledby="booking-rules-title" className="rounded-2xl border border-border/80 bg-secondary/50 p-5">
      <h2 id="booking-rules-title" className="font-serif text-lg font-semibold text-foreground">
        {t.bookingRulesTitle}
      </h2>
      <span aria-hidden="true" className="mt-2 block h-px w-10 bg-brass" />
      <ul className="mt-4 space-y-4">
        {bookingRules.map((rule) => (
          <li key={rule.title} className="flex items-start gap-3">
            <rule.icon className="mt-0.5 h-4 w-4 shrink-0 text-brass-strong" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{rule.title}</p>
              <p className="mt-0.5 break-words text-sm leading-relaxed text-muted-foreground">{rule.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
