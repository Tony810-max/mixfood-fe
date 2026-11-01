import { RESERVATION_STATUS } from '@/constants';
import { CheckCircle2, Clock3, UserCheck, XCircle, type LucideIcon } from 'lucide-react';

export interface ReservationStatusStyle {
  /** Border + fill + text classes, token based and AA-contrast on the card surface. */
  badge: string;
  /** Icon tint for tiles (decorative; the text label always carries the meaning). */
  tone: string;
  icon: LucideIcon;
}

export const STATUS_STYLES: Record<string, ReservationStatusStyle> = {
  [RESERVATION_STATUS.PENDING]: {
    badge: 'border-warning/40 bg-warning/15 text-warning-foreground',
    tone: 'bg-warning/15 text-warning-foreground',
    icon: Clock3,
  },
  [RESERVATION_STATUS.CONFIRMED]: {
    badge: 'border-success/30 bg-success/10 text-success',
    tone: 'bg-success/10 text-success',
    icon: CheckCircle2,
  },
  [RESERVATION_STATUS.ARRIVED]: {
    badge: 'border-info/30 bg-info/10 text-info',
    tone: 'bg-info/10 text-info',
    icon: UserCheck,
  },
  [RESERVATION_STATUS.CANCELLED]: {
    badge: 'border-destructive/30 bg-destructive/10 text-destructive',
    tone: 'bg-destructive/10 text-destructive',
    icon: XCircle,
  },
};

const FALLBACK_STYLE: ReservationStatusStyle = {
  badge: 'border-border bg-muted text-muted-foreground',
  tone: 'bg-muted text-muted-foreground',
  icon: Clock3,
};

export const getReservationStatusStyle = (status: string): ReservationStatusStyle =>
  STATUS_STYLES[status] ?? FALLBACK_STYLE;
