import { useLanguage } from "@/contexts/LanguageContext"
import { getRestaurantInfo } from "./utils/const"

export const BookingInfoCards = () => {
  const { t } = useLanguage()
  const RESTAURANT_INFO = getRestaurantInfo(t)

  return (
    <ul className="divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-layered">
      {RESTAURANT_INFO.map((info) => (
        <li key={info.title} className="flex items-start gap-3.5 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
            <info.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{info.title}</p>
            <p className="mt-0.5 break-words text-sm leading-relaxed text-muted-foreground">{info.description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
