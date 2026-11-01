import { RESERVATION_STATUS } from '@/constants';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { getReservationStatusStyle } from './reservationStatusStyle';

interface ReservationsStatsProps {
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    arrived: number;
    cancelled: number;
  };
  labels: {
    total: string;
    pending: string;
    confirmed: string;
    arrived: string;
    cancelled: string;
  };
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  tone,
  index,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: string;
  index: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
    className={cn('rounded-2xl border border-border/80 bg-card p-4 shadow-layered', className)}
  >
    <div className="flex items-center gap-3">
      <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', tone)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted-foreground sm:text-sm">{label}</p>
        <p className="font-serif text-2xl font-semibold leading-tight tabular-nums text-foreground">{value}</p>
      </div>
    </div>
  </motion.div>
);

export const ReservationsStats = ({ stats, labels }: ReservationsStatsProps) => {
  const pending = getReservationStatusStyle(RESERVATION_STATUS.PENDING);
  const confirmed = getReservationStatusStyle(RESERVATION_STATUS.CONFIRMED);
  const arrived = getReservationStatusStyle(RESERVATION_STATUS.ARRIVED);
  const cancelled = getReservationStatusStyle(RESERVATION_STATUS.CANCELLED);

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
      <StatCard
        index={0}
        icon={CalendarDays}
        label={labels.total}
        value={stats.total}
        tone="bg-secondary text-primary"
        className="col-span-2 md:col-span-1"
      />
      <StatCard index={1} icon={pending.icon} label={labels.pending} value={stats.pending} tone={pending.tone} />
      <StatCard index={2} icon={confirmed.icon} label={labels.confirmed} value={stats.confirmed} tone={confirmed.tone} />
      <StatCard index={3} icon={arrived.icon} label={labels.arrived} value={stats.arrived} tone={arrived.tone} />
      <StatCard index={4} icon={cancelled.icon} label={labels.cancelled} value={stats.cancelled} tone={cancelled.tone} />
    </div>
  );
};
