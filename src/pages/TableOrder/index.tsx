/**
 * QR Table Ordering Page
 *
 * Entry point: /q/:token
 *
 * Flow:
 *   1. Read :token from URL.
 *   2. GET /q/:token → receive sessionToken + table info + menu + current orders.
 *   3. Store sessionToken in sessionStorage via TableSessionContext.
 *   4. Render <TableOrderProvider> wrapping <Outlet /> (nested routes handle tabs).
 *
 * On page refresh:
 *   - If sessionToken exists in sessionStorage, call GET /customer/session to
 *     recover current state without a new scan.
 *
 * Session closed / expired:
 *   - Show "Your session has ended" screen.
 *   - Clear stored token.
 */

import { useEffect, useState } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { CheckCircle2, QrCode, RefreshCw, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTableSession } from '@/contexts/TableSessionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  scanQrCode,
  getSessionState,
  getMenu,
  type ScanResponse,
  type OrderResponse,
  type MessageResponse,
  type StaffCallResponse,
} from '@/services/table-session.service';
import { TableOrderProvider } from './TableOrderContext';
import { getApiError } from './helpers';

// ─── Session init state (kept local — not in context) ─────────────────────────

interface SessionInitData {
  menu: ScanResponse['menu'];
  orders: OrderResponse[];
  messages: MessageResponse[];
  staffCalls: StaffCallResponse[];
  paymentRequested: boolean;
  paymentPaid: boolean;
}

export default function TableOrderPage() {
  const { t } = useLanguage();
  const { token } = useParams<{ token: string }>();
  const { sessionToken, session, table, setSessionData, clearSession } = useTableSession();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [paymentPaidOnEnd, setPaymentPaidOnEnd] = useState(false);

  // Initial data hydrated from the scan/recovery response — passed into the provider
  const [initData, setInitData] = useState<SessionInitData | null>(null);

  // ─── Load session ──────────────────────────────────────────────────────────

  useEffect(() => {
    async function init() {
      setLoading(true);
      setError(null);
      try {
        let tok = sessionToken;

        // If we have a stored session token, try to recover state first.
        if (tok) {
          try {
            const state = await getSessionState(tok);

            const recoveredSession = state.session;
            const recoveredTable = recoveredSession?.table ?? null;

            if (recoveredSession && recoveredTable) {
              setSessionData(
                tok,
                {
                  id: recoveredSession.id,
                  status: recoveredSession.status,
                  openedAt: recoveredSession.openedAt,
                  expiresAt: recoveredSession.expiresAt,
                },
                {
                  id: recoveredTable.id ?? 0,
                  tableNumber: recoveredTable.tableNumber ?? '',
                  name: recoveredTable.name,
                  capacity: recoveredTable.capacity ?? 4,
                  status: recoveredTable.status ?? 'OCCUPIED',
                },
              );
            }

            const menuData = await getMenu(tok);

            const pr = state.paymentRequest;
            const paid = pr?.status === 'PAID';

            // Check session closure state
            if (
              recoveredSession?.status === 'CLOSED' ||
              recoveredSession?.status === 'PAID'
            ) {
              setPaymentPaidOnEnd(recoveredSession.status === 'PAID');
              setSessionEnded(true);
              clearSession();
              setLoading(false);
              return;
            }

            setInitData({
              menu: menuData,
              orders: state.orders ?? [],
              messages: state.messages ?? [],
              staffCalls: state.staffCalls ?? [],
              paymentRequested: !!pr,
              paymentPaid: paid,
            });
            setLoading(false);
            return;
          } catch {
            // Token expired, session closed, or server error — clear and fall through to re-scan
            clearSession();
            tok = null;
          }
        }

        // Fresh scan (no stored token, or recovery failed)
        if (!token) {
          setError(t.invalidQr);
          setLoading(false);
          return;
        }

        const scanData = await scanQrCode(token);
        setSessionData(scanData.sessionToken, scanData.session, scanData.table);

        setInitData({
          menu: scanData.menu,
          orders: scanData.currentOrders ?? [],
          messages: [],
          staffCalls: [],
          paymentRequested: false,
          paymentPaid: false,
        });
      } catch (err: unknown) {
        const { code } = getApiError(err);
        if (code === 'TABLE_INACTIVE' || code === 'TABLE_OUT_OF_SERVICE') {
          setError(t.tableUnavailable);
        } else if (code === 'SESSION_CLOSED' || code === 'SESSION_EXPIRED') {
          setSessionEnded(true);
          clearSession();
        } else {
          setError(t.restaurantUnreachable);
        }
      }
      setLoading(false);
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ─── Render states ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-background" role="status" aria-live="polite">
        <div className="bg-primary px-4 pb-4 text-primary-foreground pt-safe-top">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-foreground/10 ring-1 ring-brass/60">
              <QrCode className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="font-serif text-lg font-semibold">{t.openingYourTable}</h1>
              <p className="text-xs text-primary-foreground/75">{t.loadingTableSession}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 p-4" aria-hidden="true">
          <Skeleton className="h-11 w-full rounded-xl" />
          <div className="flex gap-2 overflow-hidden">
            <Skeleton className="h-11 w-28 shrink-0 rounded-full" />
            <Skeleton className="h-11 w-24 shrink-0 rounded-full" />
            <Skeleton className="h-11 w-32 shrink-0 rounded-full" />
          </div>
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-3">
              <Skeleton className="h-20 w-20 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sessionEnded) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background px-6">
        <div className="relative w-full max-w-sm rounded-2xl border border-border/80 bg-card p-7 text-center shadow-layered" role="status">
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-brass/70" />
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success ring-1 ring-success/30">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-xl font-semibold text-foreground">{t.sessionEnded}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {paymentPaidOnEnd
              ? t.sessionEndedPaid
              : t.sessionEndedUnpaid}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background px-6">
        <div className="relative w-full max-w-sm rounded-2xl border border-border/80 bg-card p-7 text-center shadow-layered" role="alert">
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-brass/70" />
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/30">
            <TriangleAlert className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-xl font-semibold text-foreground">{t.connectionError}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-5 w-full active:scale-[0.98]" size="lg" onClick={() => window.location.reload()}>
            <RefreshCw aria-hidden="true" /> {t.reconnect}
          </Button>
        </div>
      </div>
    );
  }

  if (!session || !table || !initData || !sessionToken) return null;

  // ─── Active session — render provider + nested routes ──────────────────────

  return (
    <TableOrderProvider
      sessionToken={sessionToken}
      onSessionEnded={() => {
        setSessionEnded(true);
      }}
      initialMenu={initData.menu}
      initialOrders={initData.orders}
      initialMessages={initData.messages}
      initialStaffCalls={initData.staffCalls}
      initialPaymentRequested={initData.paymentRequested}
      initialPaymentPaid={initData.paymentPaid}
    >
      <Outlet />
    </TableOrderProvider>
  );
}
