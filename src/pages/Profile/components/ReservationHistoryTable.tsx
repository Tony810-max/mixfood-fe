import { translateUi } from '@/lib/localization';

import { useLanguage, useUiText } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { RESERVATION_STATUS } from '@/constants';
import { cn } from '@/lib/utils';
import { Reservation } from '@/types';
import { ROUTES } from '@/utils/const';
import { Calendar, Clock, Phone, RefreshCw, Search, TriangleAlert, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { CancelReservationDialog } from '../../Reservations/components/CancelReservationDialog';
import { ReservationStatusBadge } from '../../Reservations/components/ReservationStatusBadge';
import { ReservationsStats } from '../../Reservations/components/ReservationsStats';

interface ReservationHistoryTableProps {
  reservations: Reservation[];
  isLoading: boolean;
  /** Query error from the reservations hook; shows a retry state when set. */
  error?: unknown;
  stats: { total: number; pending: number; confirmed: number; arrived: number; cancelled: number };
  onRefresh: () => Promise<unknown> | void;
  onCancel: (id: number, reason: string) => void;
  isCancelling: boolean;
  labels: Record<string, string>;
}

const selectClass =
  'min-h-11 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground shadow-sm transition-[border-color,box-shadow] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 md:w-auto';

export function ReservationHistoryTable({ reservations, isLoading, error, stats, onRefresh, onCancel, isCancelling, labels }: ReservationHistoryTableProps) {
  const ui = useUiText();
  const { t } = useLanguage();
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date-desc');
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const rows = useMemo(() => reservations
    .filter((reservation) => status === 'ALL' || reservation.status === status)
    .filter((reservation) => `${reservation.name} ${reservation.phone} ${reservation.note ?? ''}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const first = new Date(a.createdAt).getTime();
      const second = new Date(b.createdAt).getTime();
      return sort === 'date-asc' ? first - second : sort === 'status' ? a.status.localeCompare(b.status) : second - first;
    }), [reservations, search, sort, status]);
  const statusLabel = (value: string) => ({ PENDING: labels.pending, CONFIRMED: labels.confirmed, ARRIVED: labels.arrived, CANCELLED: labels.cancelled }[value] ?? value);
  const isAutomaticallyCancelled = (reservation: Reservation) =>
    reservation.cancelledBy?.name === ui("System") || reservation.rejectionReason?.startsWith(ui("Automatically cancelled:"));
  const cancellationReason = (reservation: Reservation) =>
    isAutomaticallyCancelled(reservation) ? labels.automaticCancellationReason : reservation.rejectionReason;
  const cancelledByLabel = (reservation: Reservation) => {
    if (!reservation.cancelledBy) return '—';
    if (isAutomaticallyCancelled(reservation)) return `${labels.cancelledBySystem} (${labels.cancelledByAdmin})`;
    return `${reservation.cancelledBy.name} (${reservation.cancelledBy.role === 'ADMIN' ? labels.cancelledByAdmin : labels.cancelledByUser})`;
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
      toast.success(translateUi(labels.refreshSuccess), { duration: 2000 });
    } catch {
      toast.error(translateUi(labels.refreshError), { duration: 2000 });
    } finally {
      setRefreshing(false);
    }
  };
  const clearFilters = () => {
    setStatus('ALL');
    setSearch('');
  };
  const formatDate = (reservation: Reservation) => new Date(reservation.reservationDate).toLocaleDateString(labels.locale);
  const hasFilters = status !== 'ALL' || search !== '';

  return (
    <section className="space-y-5" aria-labelledby="reservations-history-title">
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-layered sm:p-6">
        <h2 id="reservations-history-title" className="font-serif text-xl font-semibold text-foreground">{labels.title}</h2>
        <span aria-hidden="true" className="mt-1.5 block h-px w-10 bg-brass" />
        <p className="mt-3 text-sm text-muted-foreground">{labels.subtitle}</p>
      </div>
      <ReservationsStats stats={stats} labels={{ total: labels.total, pending: labels.pending, confirmed: labels.confirmed, arrived: labels.arrived, cancelled: labels.cancelled }} />
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-layered">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input type="search" aria-label={labels.search} value={search} onChange={(event) => setSearch(event.target.value)} className="pl-10" placeholder={labels.search} />
          </div>
          <select aria-label={labels.status} value={status} onChange={(event) => setStatus(event.target.value)} className={selectClass}>
            <option value="ALL">{labels.all}</option><option value="PENDING">{labels.pending}</option><option value="CONFIRMED">{labels.confirmed}</option><option value="ARRIVED">{labels.arrived}</option><option value="CANCELLED">{labels.cancelled}</option>
          </select>
          <select aria-label={ui("Sort reservations")} value={sort} onChange={(event) => setSort(event.target.value)} className={selectClass}>
            <option value="date-desc">{labels.newest}</option><option value="date-asc">{labels.oldest}</option><option value="status">{labels.byStatus}</option>
          </select>
          <Button type="button" variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing} title={labels.refresh} aria-label={labels.refresh} className="w-full shrink-0 md:w-11">
            <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} aria-hidden="true" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div role="status" aria-live="polite" className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
          <span className="sr-only">{ui("Loading content…")}</span>
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-3 rounded-2xl border border-border/80 bg-card p-4 shadow-layered">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      ) : error && reservations.length === 0 ? (
        <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <TriangleAlert className="mx-auto mb-3 h-8 w-8 text-destructive" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">{ui("Unable to connect. Please try again.")}</p>
          <Button type="button" variant="outline" className="mt-4" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={cn(refreshing && 'animate-spin')} aria-hidden="true" />
            {t.menuRetry}
          </Button>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
          <Calendar className="mx-auto mb-3 h-9 w-9 text-brass-strong" aria-hidden="true" />
          <p className="text-sm font-medium text-muted-foreground">{labels.empty}</p>
          {hasFilters ? (
            <Button type="button" variant="outline" className="mt-4" onClick={clearFilters}>{t.clearFilters}</Button>
          ) : (
            <Button asChild className="mt-4">
              <Link to={ROUTES.RESERVE}>{t.reserveTable}</Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Cards: phones and tablets */}
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:hidden">
            {rows.map((reservation) => {
              const reason = cancellationReason(reservation);
              const isCancelled = reservation.status === RESERVATION_STATUS.CANCELLED;
              return (
                <li key={reservation.id} className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-layered transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-layered-hover">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground" title={reservation.name}>{reservation.name}</p>
                      <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate" title={reservation.phone}>{reservation.phone}</span>
                      </p>
                    </div>
                    <ReservationStatusBadge status={reservation.status} label={statusLabel(reservation.status)} className="shrink-0 text-xs" />
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm min-[400px]:grid-cols-2">
                    <p className="flex min-w-0 items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2 font-medium tabular-nums">
                      <Clock className="h-4 w-4 shrink-0 text-brass-strong" aria-hidden="true" />
                      <span className="sr-only">{labels.date}</span>
                      {formatDate(reservation)} · {reservation.reservationTime}
                    </p>
                    <p className="flex min-w-0 items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2 font-medium tabular-nums">
                      <Users className="h-4 w-4 shrink-0 text-brass-strong" aria-hidden="true" />
                      {reservation.numberOfGuests} {labels.guests}
                    </p>
                  </div>
                  {isCancelled && (
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm">
                      <p className="break-words [overflow-wrap:anywhere]"><span className="text-muted-foreground">{labels.cancelledBy}: </span>{cancelledByLabel(reservation)}</p>
                      {reason && <p className="mt-1 break-words text-muted-foreground [overflow-wrap:anywhere]"><span className="font-medium text-foreground">{labels.reason}: </span>{reason}</p>}
                    </div>
                  )}
                  {reservation.status === RESERVATION_STATUS.PENDING && (
                    <Button type="button" variant="outline" className="mt-auto w-full" onClick={() => setSelected(reservation)}>{labels.cancel}</Button>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Table: wide screens */}
          <div className="hidden overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-layered xl:block">
            <Table className="min-w-[920px]">
              <TableHeader>
                <TableRow>
                  <TableHead>{labels.customer}</TableHead>
                  <TableHead>{labels.date}</TableHead>
                  <TableHead>{labels.guests}</TableHead>
                  <TableHead>{labels.status}</TableHead>
                  <TableHead>{labels.cancelledBy}</TableHead>
                  <TableHead className="min-w-52">{labels.reason}</TableHead>
                  <TableHead className="text-right">{labels.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((reservation) => {
                  const reason = cancellationReason(reservation);
                  const isCancelled = reservation.status === RESERVATION_STATUS.CANCELLED;
                  return (
                    <TableRow key={reservation.id} className="border-border/70 hover:bg-accent/60">
                      <TableCell>
                        <Tooltip><TooltipTrigger asChild><div className="max-w-40 cursor-default"><p className="truncate font-medium">{reservation.name}</p><p className="truncate text-xs text-muted-foreground">{reservation.phone}</p></div></TooltipTrigger><TooltipContent>{reservation.name} · {reservation.phone}</TooltipContent></Tooltip>
                      </TableCell>
                      <TableCell className="tabular-nums">{formatDate(reservation)}<br /><span className="text-xs text-muted-foreground">{reservation.reservationTime}</span></TableCell>
                      <TableCell className="tabular-nums">{reservation.numberOfGuests}</TableCell>
                      <TableCell><ReservationStatusBadge status={reservation.status} label={statusLabel(reservation.status)} className="text-xs" /></TableCell>
                      <TableCell className="max-w-48 whitespace-normal break-words text-sm [overflow-wrap:anywhere]">{isCancelled ? cancelledByLabel(reservation) : '—'}</TableCell>
                      <TableCell className="max-w-64 whitespace-normal text-sm text-muted-foreground">
                        {isCancelled && reason ? <Tooltip><TooltipTrigger asChild><p className="cursor-default line-clamp-2 break-words [overflow-wrap:anywhere]">{reason}</p></TooltipTrigger><TooltipContent className="max-w-xs">{reason}</TooltipContent></Tooltip> : '—'}
                      </TableCell>
                      <TableCell className="text-right">{reservation.status === RESERVATION_STATUS.PENDING && <Button type="button" variant="outline" size="sm" onClick={() => setSelected(reservation)}>{labels.cancel}</Button>}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
      <CancelReservationDialog isOpen={Boolean(selected)} reservationName={selected?.name} onCancel={() => setSelected(null)} onConfirm={(reason) => { if (selected) { onCancel(selected.id, reason); setSelected(null); } }} isPending={isCancelling} labels={{ title: labels.cancelTitle, description: labels.cancelDescription, cancel: labels.keep, confirm: labels.cancel, confirming: labels.cancelling, reasonLabel: labels.reason, reasonPlaceholder: labels.reasonPlaceholder, reasonHint: labels.reasonHint }} />
    </section>
  );
}
