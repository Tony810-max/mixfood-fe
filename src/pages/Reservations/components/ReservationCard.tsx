import { RESERVATION_STATUS } from '@/constants';
import { useDateFormat } from '@/hooks/useDateFormat';
import { Reservation } from '@/types';
import { motion } from 'framer-motion';
import { Calendar, Clock, Phone, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ReservationStatusBadge } from './ReservationStatusBadge';
import { CancelReservationDialog } from './CancelReservationDialog';

interface ReservationCardProps {
  reservation: Reservation;
  index: number;
  getStatusLabel: (status: string) => string;
  onCancel: (id: number, reason: string) => void;
  isCancelling?: boolean;
  labels: {
    date: string;
    time: string;
    guests: string;
    guest: string;
    phone: string;
    note: string;
    cancel: string;
    cancelDialogTitle: string;
    cancelDialogDescription: string;
    cancelDialogCancel: string;
    cancelDialogConfirm: string;
    cancelDialogConfirming: string;
    cancelledBy: string;
    cancelledByUser: string;
    cancelledByAdmin: string;
    cancellationReason: string;
    cancellationReasonPlaceholder: string;
    cancellationReasonHint: string;
  };
}

export const ReservationCard = ({
  reservation,
  index,
  getStatusLabel,
  onCancel,
  isCancelling = false,
  labels,
}: ReservationCardProps) => {
  const { formatDate } = useDateFormat();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCancelConfirm = (reason: string) => {
    onCancel(reservation.id, reason);
    setShowCancelDialog(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-card rounded-2xl shadow-layered border border-border/80 overflow-hidden"
      >
        <div className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            {/* Status Badge - Mobile Top, Desktop Right */}
            <div className="lg:hidden flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-lg font-semibold text-foreground truncate" title={reservation.name}>
                  {reservation.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  <span className="block truncate" title={reservation.phone}>{reservation.phone}</span>
                </p>
              </div>
              <ReservationStatusBadge status={reservation.status} label={getStatusLabel(reservation.status)} />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="hidden lg:flex items-start justify-between mb-4">
                <div className="min-w-0 flex-1 pr-3">
                  <h3 className="break-words text-xl font-semibold text-foreground mb-1 [overflow-wrap:anywhere]">
                    {reservation.name}
                  </h3>
                  <p className="truncate text-sm text-muted-foreground" title={reservation.phone}>
                    {reservation.phone}
                  </p>
                </div>
                <ReservationStatusBadge status={reservation.status} label={getStatusLabel(reservation.status)} />
              </div>

              {/* Reservation Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm p-3 bg-secondary/60 rounded-lg">
                  <Calendar className="h-4 w-4 text-brass-strong flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{labels.date}</p>
                    <p className="font-medium text-foreground truncate">{formatDate(reservation.reservationDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm p-3 bg-secondary/60 rounded-lg">
                  <Clock className="h-4 w-4 text-brass-strong flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{labels.time}</p>
                    <p className="font-medium text-foreground">{reservation.reservationTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm p-3 bg-secondary/60 rounded-lg">
                  <Users className="h-4 w-4 text-brass-strong flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{labels.guests}</p>
                    <p className="font-medium text-foreground">{reservation.numberOfGuests} {labels.guest}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm p-3 bg-secondary/60 rounded-lg">
                  <Phone className="h-4 w-4 text-brass-strong flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{labels.phone}</p>
                    <p className="font-medium text-foreground truncate">{reservation.phone}</p>
                  </div>
                </div>
              </div>

              {reservation.note && (
                <div className="mb-4 p-3 bg-warning/10 rounded-lg border border-warning/30">
                  <p className="break-words text-sm text-foreground [overflow-wrap:anywhere]">
                    <span className="font-medium">{labels.note}:</span> {reservation.note}
                  </p>
                </div>
              )}

              {reservation.status === RESERVATION_STATUS.CANCELLED && (
                <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 break-words text-sm text-destructive [overflow-wrap:anywhere]">
                  <p>
                    <span className="font-medium">{labels.cancelledBy}:</span>{' '}
                    {reservation.cancelledBy
                      ? `${reservation.cancelledBy.name} (${reservation.cancelledBy.role === 'ADMIN'
                          ? labels.cancelledByAdmin
                          : labels.cancelledByUser})`
                      : '—'}
                  </p>
                  {reservation.rejectionReason && (
                    <p className="mt-1">
                      <span className="font-medium">{labels.cancellationReason}:</span>{' '}
                      {reservation.rejectionReason}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            {reservation.status === RESERVATION_STATUS.PENDING && (
              <div className="flex lg:flex-col gap-2 lg:w-auto w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 lg:flex-none text-destructive border-destructive/30 hover:text-destructive-foreground hover:bg-destructive hover:border-destructive transition-colors"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={isCancelling}
                >
                  {labels.cancel}
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <CancelReservationDialog
        isOpen={showCancelDialog}
        reservationName={reservation.name}
        onCancel={() => setShowCancelDialog(false)}
        onConfirm={handleCancelConfirm}
        isPending={isCancelling}
        labels={{
          title: labels.cancelDialogTitle,
          description: labels.cancelDialogDescription,
          cancel: labels.cancelDialogCancel,
          confirm: labels.cancelDialogConfirm,
          confirming: labels.cancelDialogConfirming,
          reasonLabel: labels.cancellationReason,
          reasonPlaceholder: labels.cancellationReasonPlaceholder,
          reasonHint: labels.cancellationReasonHint,
        }}
      />
    </>
  );
};
