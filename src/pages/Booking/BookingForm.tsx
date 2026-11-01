
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage, useUiText } from "@/contexts/LanguageContext"
import { useCreateReservation } from "@/hooks/api/useReservations"
import { BOOKING_WINDOW, VALIDATION } from "@/constants"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/utils/const"
import { logger } from "@/utils/logger"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Mail, Phone, User, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { BookingFormValues, bookingSchema } from "./utils/bookingSchema"
import type { BookingSuccessState } from "./utils/bookingSummary"

const minimumBookingTimeForDate = (date: Date) => {
  const selectedDate = new Date(date)
  selectedDate.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (selectedDate.getTime() !== today.getTime()) return BOOKING_WINDOW.OPEN

  const minimumDateTime = new Date(
    Date.now() + VALIDATION.MIN_ADVANCE_BOOKING_MINUTES * 60 * 1000,
  )
  const time = `${String(minimumDateTime.getHours()).padStart(2, '0')}:${String(minimumDateTime.getMinutes()).padStart(2, '0')}`
  return time < BOOKING_WINDOW.OPEN ? BOOKING_WINDOW.OPEN : time
}

const BOOKING_HOURS = Array.from(
  { length: Number(BOOKING_WINDOW.LAST_BOOKING.slice(0, 2)) - Number(BOOKING_WINDOW.OPEN.slice(0, 2)) + 1 },
  (_, index) => Number(BOOKING_WINDOW.OPEN.slice(0, 2)) + index,
)
const BOOKING_MINUTES = Array.from({ length: 12 }, (_, index) => index * 5)

const toTimeString = (hour: number, minute: number) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

export const BookingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()
  const ui = useUiText()
  const { user } = useAuth()
  const createReservation = useCreateReservation()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [minTime, setMinTime] = useState<string>(BOOKING_WINDOW.OPEN)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      date: new Date(),
      guests: 1, // Number to match schema transformation
      specialRequests: "",
    },
  })
  const selectedTime = form.watch('time')

  useEffect(() => {
    setMinTime(minimumBookingTimeForDate(form.getValues('date')))
  }, [])

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true)
    try {
      logger.debug('Booking form submitted with data:', data)
      
      const payload = {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        // Send a calendar date, not a browser-timezone timestamp. The booking
        // date must remain the same business day on every server timezone.
        reservationDate: format(data.date, 'yyyy-MM-dd'),
        reservationTime: data.time,
        numberOfGuests: Number(data.guests), // Convert to number for API
        note: data.specialRequests || undefined,
        userId: user?.id,
      }
      
      logger.debug('Sending reservation payload:', payload)
      
      await createReservation.mutateAsync(payload)
      
      // Same destination as before; the typed values ride along as router state
      // so the success page can show a summary (it falls back cleanly without).
      const successState: BookingSuccessState = {
        reservation: {
          name: payload.name,
          phone: payload.phone,
          date: payload.reservationDate,
          time: payload.reservationTime,
          guests: payload.numberOfGuests,
          note: payload.note,
        },
      }
      form.reset()
      navigate(ROUTES.BOOKING_SUCCESS, { state: successState })
    } catch (error) {
      logger.error('Reservation creation failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue('date', date)
      setIsCalendarOpen(false)
      
      const nextMinTime = minimumBookingTimeForDate(date)
      setMinTime(nextMinTime)

      // A time that was valid for another date may be too soon today.
      if (form.getValues('time') && form.getValues('time') < nextMinTime) {
        form.setValue('time', '', { shouldValidate: true })
      }
    }
  }

  const handleTimeChange = (type: 'hour' | 'minute', value: number) => {
    const [currentHour, currentMinute] = (form.getValues('time') || minTime)
      .split(':')
      .map(Number)
    const nextTime = toTimeString(
      type === 'hour' ? value : currentHour,
      type === 'minute' ? value : currentMinute,
    )

    if (nextTime >= minTime && nextTime <= BOOKING_WINDOW.LAST_BOOKING) {
      form.setValue('time', nextTime, { shouldValidate: true, shouldDirty: true })
    }
  }

  const isTimeAvailable = (hour: number, minute: number) => {
    const time = toTimeString(hour, minute)
    return time >= minTime && time <= BOOKING_WINDOW.LAST_BOOKING
  }

  const isBusy = isSubmitting || createReservation.isPending

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/70 bg-secondary/40 p-5 md:p-7">
        <CardTitle className="font-serif text-2xl font-semibold md:text-3xl">{t.bookingFormTitle}</CardTitle>
        <span aria-hidden="true" className="block h-px w-12 bg-brass" />
        <CardDescription className="pt-1 text-sm leading-relaxed md:text-base">
          {t.bookingFormDesc}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 md:p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" aria-busy={isBusy}>
            <section aria-labelledby="booking-contact-title" className="space-y-4">
              <h3 id="booking-contact-title" className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-brass-strong">
                {ui("Your details")}
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        {t.fullName}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.fullNamePlaceholder}
                          autoComplete="name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        {t.phoneNumber}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder={t.phonePlaceholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      {t.email}
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="email"
                        inputMode="email"
                        placeholder={t.emailPlaceholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section aria-labelledby="booking-details-title" className="space-y-4">
              <h3 id="booking-details-title" className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-brass-strong">
                {ui("Reservation details")}
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
                <div>
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          {t.dateTime}
                        </FormLabel>
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-11 w-full justify-start bg-card pl-3.5 text-left font-normal tabular-nums hover:bg-accent",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value && selectedTime ? (
                                  format(field.value, "dd/MM/yyyy") + ` ${selectedTime}`
                                ) : (
                                  <span className="text-muted-foreground">{t.bookingSelectDate} &amp; {t.bookingSelectTime}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 text-muted-foreground" aria-hidden="true" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-0" align="start">
                            <div className="sm:flex">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={handleDateSelect}
                                disabled={(date) => {
                                  const today = new Date()
                                  today.setHours(0, 0, 0, 0)
                                  return date < today
                                }}
                                initialFocus
                                className="rounded-lg"
                                classNames={{
                                  day: "h-9 w-9 p-0 font-normal aria-selected:bg-primary aria-selected:text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                                  day_today: "bg-accent text-accent-foreground",
                                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                                  day_disabled: "text-muted-foreground opacity-50",
                                }}
                              />
                              <div className="flex border-t border-border sm:h-[330px] sm:border-l sm:border-t-0">
                                <ScrollArea className="w-1/2 sm:w-20">
                                  <div className="flex gap-1 p-2 sm:flex-col">
                                    {BOOKING_HOURS.map((hour) => {
                                      const isSelected = selectedTime?.startsWith(`${String(hour).padStart(2, '0')}:`)
                                      const available = BOOKING_MINUTES.some((minute) => isTimeAvailable(hour, minute))
                                      return (
                                        <Button key={hour} type="button" size="sm" variant={isSelected ? "default" : "ghost"} disabled={!available} className="shrink-0 tabular-nums sm:w-full" onClick={() => handleTimeChange('hour', hour)}>
                                          {String(hour).padStart(2, '0')}
                                        </Button>
                                      )
                                    })}
                                  </div>
                                  <ScrollBar orientation="horizontal" className="sm:hidden" />
                                </ScrollArea>
                                <ScrollArea className="w-1/2 sm:w-20">
                                  <div className="flex gap-1 p-2 sm:flex-col">
                                    {BOOKING_MINUTES.map((minute) => {
                                      const hour = Number((selectedTime || minTime).slice(0, 2))
                                      const isSelected = selectedTime?.endsWith(`:${String(minute).padStart(2, '0')}`)
                                      return (
                                        <Button key={minute} type="button" size="sm" variant={isSelected ? "default" : "ghost"} disabled={!isTimeAvailable(hour, minute)} className="shrink-0 tabular-nums sm:w-full" onClick={() => handleTimeChange('minute', minute)}>
                                          {String(minute).padStart(2, '0')}
                                        </Button>
                                      )
                                    })}
                                  </div>
                                  <ScrollBar orientation="horizontal" className="sm:hidden" />
                                </ScrollArea>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={() => (
                      <FormItem className="mt-2">
                        <FormDescription className="text-xs leading-relaxed">
                          {t.bookingTimeHelp}
                        </FormDescription>
                        <FormMessage role="alert" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        {t.numberOfGuests}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min="1"
                          max="50"
                          className="tabular-nums"
                          placeholder={t.bookingGuestsPlaceholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.bookingSpecialRequests}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t.bookingSpecialRequestsPlaceholder}
                        className="resize-none rounded-xl bg-card text-base md:text-sm"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {t.bookingSpecialRequestsDesc}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <Button
              type="submit"
              size="lg"
              className="w-full active:scale-[0.98]"
              disabled={isBusy}
            >
              {isBusy && <Loader2 className="animate-spin" aria-hidden="true" />}
              {isBusy ? t.bookingSubmitting : t.bookingSubmitButton}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
