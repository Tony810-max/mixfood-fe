/**
 * BillPage
 *
 * Shows the full bill summary and allows the customer to request payment.
 */

import { useState } from 'react';
import { CheckCircle2, CreditCard, LoaderCircle, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTableOrder } from './TableOrderContext';
import { formatVND } from './helpers';

export default function BillPage() {
  const { t, lang } = useLanguage();
  const { orders, paymentRequested, paymentPaid, handleRequestPayment } =
    useTableOrder();
  const [requesting, setRequesting] = useState(false);

  const nonCancelledOrders = orders.filter((o) => o.status !== 'CANCELLED');
  const sessionTotal = nonCancelledOrders.reduce((sum, o) => sum + o.total, 0);
  const itemName = (item: { productNameSnapshot: { vn?: string; en?: string } }) => lang === 'vn' ? item.productNameSnapshot.vn || item.productNameSnapshot.en : item.productNameSnapshot.en || item.productNameSnapshot.vn;

  const requestPayment = async () => {
    setRequesting(true);
    try {
      await handleRequestPayment();
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <section aria-labelledby="bill-summary-title" className="relative space-y-4 rounded-2xl border border-border/80 bg-card p-5 shadow-layered">
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-0 h-px bg-brass/70" />
        <div className="flex items-center gap-2.5 text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
            <Receipt className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 id="bill-summary-title" className="font-serif text-lg font-semibold">{t.billSummary}</h2>
        </div>
        {nonCancelledOrders.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">{t.noOrdersYet}</p>
        ) : (
          <ul className="space-y-4">
            {nonCancelledOrders.map((order) => (
              <li key={order.id}>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass-strong">
                  {t.orderNumber.replace('{number}', String(order.id))}
                </p>
                <ul className="space-y-1.5">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex gap-3 text-sm">
                      <span className="min-w-0 flex-1 break-words text-muted-foreground [overflow-wrap:anywhere]" title={`${item.quantity}× ${itemName(item)}`}>
                        <span className="tabular-nums">{item.quantity}×</span>{' '}
                        {itemName(item)}
                      </span>
                      <span className="shrink-0 tabular-nums text-foreground">{formatVND(item.subtotal)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-baseline justify-between gap-3 border-t border-dashed border-border pt-4">
          <span className="text-base font-semibold">{t.total}</span>
          <span className="shrink-0 font-serif text-2xl font-semibold tabular-nums text-primary">{formatVND(sessionTotal)}</span>
        </div>
      </section>

      {!paymentRequested && !paymentPaid && (
        <Button
          className="w-full active:scale-[0.98]"
          size="lg"
          onClick={requestPayment}
          disabled={nonCancelledOrders.length === 0 || requesting}
        >
          {requesting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <CreditCard aria-hidden="true" />}
          {t.requestPayment}
        </Button>
      )}
      {paymentRequested && !paymentPaid && (
        <div className="rounded-2xl border border-warning/30 bg-warning/10 px-4 py-6 text-center" role="status">
          <LoaderCircle className="mx-auto mb-3 h-9 w-9 animate-spin text-warning" aria-hidden="true" />
          <p className="text-sm font-medium text-warning-foreground">
            {t.paymentWaiting}
          </p>
        </div>
      )}
      {paymentPaid && (
        <div className="rounded-2xl border border-success/25 bg-success/10 p-6 text-center" role="status">
          <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-success" aria-hidden="true" />
          <p className="font-serif text-lg font-semibold text-success">{t.paid}</p>
          <p className="mt-1 text-sm text-foreground">
            {t.thanksForDining}
          </p>
        </div>
      )}
    </div>
  );
}
