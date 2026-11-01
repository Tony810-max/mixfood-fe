import { cn } from '@/lib/utils';
import { STATUS_STYLES } from './reservationStatusStyle';

interface ReservationStatusBadgeProps {
  status: string;
  label: string;
  className?: string;
}

export const ReservationStatusBadge = ({ status, label, className }: ReservationStatusBadgeProps) => {
  const style = STATUS_STYLES[status];
  if (!style) return null;

  const Icon = style.icon;
  return (
    <div className={cn('inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-sm font-semibold', style.badge, className)}>
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {label}
    </div>
  );
};
