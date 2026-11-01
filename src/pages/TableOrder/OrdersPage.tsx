/**
 * OrdersPage
 *
 * Lists all non-cancelled orders for the current session.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ban, BellRing, CheckCircle2, ChefHat, ClipboardList, Clock3, ThumbsUp, UtensilsCrossed, type LucideIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useTableOrder } from './TableOrderContext';
import { formatVND } from './helpers';

// Kitchen progress, in order. COMPLETED counts as "everything done".
const PROGRESS_STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED'] as const;

// Token-based badge styles. Every status also carries an icon and a text label,
// so colour is never the only signal.
const STATUS_APPEARANCE: Record<string, { badge: string; icon: LucideIcon }> = {
  PENDING: { badge: 'border-warning/40 bg-warning/15 text-warning-foreground', icon: Clock3 },
  CONFIRMED: { badge: 'border-info/30 bg-info/10 text-info', icon: ThumbsUp },
  PREPARING: { badge: 'border-primary/30 bg-primary/10 text-primary', icon: ChefHat },
  READY: { badge: 'border-success/30 bg-success/10 text-success', icon: BellRing },
  SERVED: { badge: 'border-brass/50 bg-secondary text-foreground', icon: UtensilsCrossed },
  COMPLETED: { badge: 'border-border bg-muted text-muted-foreground', icon: CheckCircle2 },
};

function progressIndex(status: string) {
  if (status === 'COMPLETED') return PROGRESS_STEPS.length - 1;
  return Math.max(0, PROGRESS_STEPS.indexOf(status as (typeof PROGRESS_STEPS)[number]));
}

export default function OrdersPage() {
  const { t, lang } = useLanguage();
  const { orders, cancelOrder } = useTableOrder();
  const navigate = useNavigate();
  const [cancelTarget, setCancelTarget] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const nonCancelledOrders = orders.filter((o) => o.status !== 'CANCELLED');
  const sessionTotal = nonCancelledOrders.reduce((sum, o) => sum + o.total, 0);
  const itemName = (item: { productNameSnapshot: { vn?: string; en?: string } }) => lang === 'vn' ? item.productNameSnapshot.vn || item.productNameSnapshot.en : item.productNameSnapshot.en || item.productNameSnapshot.vn;
  const orderStatusLabels: Record<string, string> = { PENDING: t.orderPending, CONFIRMED: t.orderConfirmed, PREPARING: t.orderPreparing, READY: t.orderReady, SERVED: t.orderServed, COMPLETED: t.orderCompleted, CANCELLED: t.orderCancelled };

  const handleConfirmCancel = async () => {
    if (cancelTarget == null) return;
    setCancelling(true);
    await cancelOrder(cancelTarget);
    setCancelling(false);
    setCancelTarget(null);
  };

  return (
    <div className="space-y-3 p-4">
      {nonCancelledOrders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
          <ClipboardList className="mx-auto mb-3 h-10 w-10 text-brass-strong opacity-70" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">{t.noOrdersYet}</p>
          <Button className="mt-4" onClick={() => navigate('../menu', { relative: 'path' })}>
            {t.viewMenu}
          </Button>
        </div>
      )}
      <ul className="space-y-3" aria-live="polite">
        {nonCancelledOrders.map((order) => {
          const appearance = STATUS_APPEARANCE[order.status] ?? STATUS_APPEARANCE.PENDING;
          const StatusIcon = appearance.icon;
          const reached = progressIndex(order.status);
          return (
            <li
              key={order.id}
              className="space-y-3 rounded-2xl border border-border/80 bg-card p-4 shadow-layered"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-serif text-base font-semibold text-foreground">{t.orderNumber.replace('{number}', String(order.id))}</span>
                <span className={cn('inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold', appearance.badge)}>
                  <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {orderStatusLabels[order.status] ?? order.status}
                </span>
              </div>

              {/* Kitchen progress timeline (decorative; the badge states the status in words) */}
              <div aria-hidden="true" className="flex gap-1">
                {PROGRESS_STEPS.map((step, index) => (
                  <span
                    key={step}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-colors duration-300',
                      index <= reached ? 'bg-primary' : 'bg-border',
                    )}
                  />
                ))}
              </div>

              <ul className="space-y-1.5">
                {order.items.map((item) => {
                  const cancelled = item.status === 'CANCELLED';
                  return (
                    <li
                      key={item.id}
                      className={cn('flex gap-3 text-sm', cancelled ? 'text-muted-foreground line-through' : 'text-foreground')}
                    >
                      <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]" title={`${item.quantity}× ${itemName(item)}${item.notes ? ` (${item.notes})` : ''}`}>
                        <span className="tabular-nums">{item.quantity}×</span>{' '}
                        {itemName(item)}
                        {item.notes && (
                          <span className="ml-1 text-xs italic text-muted-foreground">({item.notes})</span>
                        )}
                      </span>
                      <span className="shrink-0 tabular-nums text-muted-foreground">{formatVND(item.subtotal)}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-3">
                <div className="flex min-w-0 items-baseline gap-2 text-sm font-semibold">
                  <span>{t.orderTotal}</span>
                  <span className="shrink-0 font-serif text-base tabular-nums text-primary">{formatVND(order.total)}</span>
                </div>
                {order.status === 'PENDING' && (
                  <button
                    type="button"
                    onClick={() => setCancelTarget(order.id)}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Ban className="h-4 w-4" aria-hidden="true" />
                    {t.cancel}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {nonCancelledOrders.length > 0 && (
        <div className="sticky bottom-0 flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-secondary p-4 font-semibold shadow-layered">
          <span>{t.total}</span>
          <span className="shrink-0 font-serif text-lg tabular-nums text-primary">{formatVND(sessionTotal)}</span>
        </div>
      )}

      <AlertDialog open={cancelTarget !== null} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.cancelOrderTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.cancelOrderDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>{t.no}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmCancel();
              }}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling ? t.cancelling : t.cancelOrder}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
