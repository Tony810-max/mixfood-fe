/**
 * Data handed from the booking form to the success page through router state.
 * Only values the guest just typed are carried over; nothing is fetched or invented.
 */
export interface BookingSummary {
  name: string
  phone: string
  /** Calendar date as `yyyy-MM-dd`. */
  date: string
  /** Time as `HH:mm`. */
  time: string
  guests: number
  note?: string
}

export interface BookingSuccessState {
  reservation: BookingSummary
}

/** Narrow unknown router state to a usable summary (state is absent after a direct visit). */
export const readBookingSummary = (state: unknown): BookingSummary | null => {
  const reservation = (state as Partial<BookingSuccessState> | null | undefined)?.reservation
  if (!reservation) return null
  const { name, phone, date, time, guests, note } = reservation
  if (typeof name !== "string" || typeof phone !== "string") return null
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  if (typeof time !== "string" || typeof guests !== "number" || !Number.isFinite(guests)) return null
  return { name, phone, date, time, guests, note: typeof note === "string" && note ? note : undefined }
}

/** Parse a `yyyy-MM-dd` string as a local calendar date (avoids UTC day shifts). */
export const parseBookingDate = (date: string): Date => {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day)
}
