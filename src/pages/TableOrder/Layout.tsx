import { FormEvent, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  BellRing,
  CheckCircle2,
  ChevronUp,
  ClipboardList,
  ConciergeBell,
  LoaderCircle,
  MessageCircle,
  ReceiptText,
  Send,
  ShoppingBag,
  UtensilsCrossed,
  WifiOff,
} from "lucide-react";
import { useTableSession } from "@/contexts/TableSessionContext";
import { useLanguage, useUiText } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useTableOrder } from "./TableOrderContext";
import { formatVND } from "./helpers";

const EASE = [0.2, 0.8, 0.2, 1] as [number, number, number, number];

/** Browser network status (the realtime socket state is internal to the provider). */
function useOnlineStatus() {
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);
  return online;
}

export default function TableOrderLayout() {
  const { t, lang } = useLanguage();
  const ui = useUiText();
  const { table } = useTableSession();
  const {
    orders, staffCalls, paymentRequested, paymentPaid, cart, setCart, cartOpen,
    setCartOpen, cartTotal, cartCount, orderNotes, setOrderNotes, submitting,
    updateQty, submitOrder, handleCallStaff, sendChat,
  } = useTableOrder();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const [chatInput, setChatInput] = useState("");
  const tabs = [
    { id: "menu", label: t.menu, icon: UtensilsCrossed },
    { id: "orders", label: t.orders, icon: ClipboardList },
    { id: "chat", label: t.staff, icon: MessageCircle },
    { id: "bill", label: t.payment, icon: ReceiptText },
  ] as const;
  const itemName = (item: { name: { vn?: string; en?: string } }) => lang === 'vn' ? item.name.vn || item.name.en : item.name.en || item.name.vn;

  const activeTab = pathname.split("/").pop() ?? "menu";
  const activeOrders = orders.filter((order) => order.status !== "CANCELLED");
  const sessionTotal = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingCallTypes = new Set(
    staffCalls
      .filter((call) => call.status === "PENDING" || call.status === "ACKNOWLEDGED")
      .map((call) => call.type),
  );

  const handleSendChat = async (event?: FormEvent) => {
    event?.preventDefault();
    const message = chatInput.trim();
    if (!message) return;
    setChatInput("");
    await sendChat(message);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative mx-auto flex h-dvh max-w-lg flex-col overflow-hidden bg-background shadow-layered-hover">
        <header className="z-20 shrink-0 bg-primary px-4 pb-3 text-primary-foreground pt-safe-top">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-foreground/10 font-serif text-lg font-semibold tabular-nums ring-1 ring-brass/60">
                {table?.tableNumber}
              </div>
              <h1 className="min-w-0 truncate font-serif text-lg font-semibold" title={t.tableLabel.replace("{number}", table?.tableNumber ?? "") + (table?.name ? ` · ${table.name}` : "")}>
                {t.tableLabel.replace('{number}', table?.tableNumber ?? '')}{table?.name ? ` · ${table.name}` : ""}
              </h1>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[11px] text-primary-foreground/75">{t.subtotal}</p>
              <p className="text-sm font-semibold tabular-nums">{formatVND(sessionTotal)}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">Mix Food · {t.tableOrder}</p>
            <span
              role="status"
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors",
                online ? "bg-card text-foreground" : "bg-warning text-warning-foreground",
              )}
            >
              {online ? (
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-success" />
              ) : (
                <WifiOff className="h-3 w-3" aria-hidden="true" />
              )}
              {online ? ui("Online") : ui("Offline")}
            </span>
          </div>
        </header>

        {paymentRequested && (
          <div
            className={cn(
              "mx-4 mt-3 flex shrink-0 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-medium",
              paymentPaid
                ? "border-success/25 bg-success/10 text-success"
                : "border-warning/30 bg-warning/10 text-warning-foreground",
            )}
            role="status"
            aria-live="polite"
          >
            {paymentPaid ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <LoaderCircle className="h-4 w-4 shrink-0 animate-spin" />}
            {paymentPaid ? t.paidThankYou : t.waitingPayment}
          </div>
        )}

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain" id="table-order-content">
          <Outlet />
        </main>

        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
          <SheetContent side="bottom" className="inset-x-0 mx-auto max-h-[88dvh] max-w-lg overflow-y-auto rounded-t-3xl border-x p-5 pb-0">
            <SheetHeader className="pr-10 text-left">
              <SheetTitle className="font-serif text-xl">{t.yourCart}</SheetTitle>
              <SheetDescription>{t.cartDescription}</SheetDescription>
            </SheetHeader>

            <div className="my-5 space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="rounded-2xl border border-border/80 bg-card p-3.5">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 break-words text-sm font-semibold [overflow-wrap:anywhere]" title={itemName(item)}>{itemName(item)}</p>
                      <p className="mt-0.5 text-sm font-semibold tabular-nums text-primary">{formatVND(item.price)}</p>
                    </div>
                    <QuantityStepper className="h-11 shrink-0" value={item.quantity} onChange={(quantity) => updateQty(item.productId, quantity)} max={99} />
                  </div>
                  <Input
                    className="mt-3 min-h-11 bg-background text-sm"
                    aria-label={t.itemNote.replace('{item}', itemName(item) ?? '')}
                    placeholder={t.itemNotePlaceholder}
                    value={item.notes}
                    onChange={(event) => setCart((current) => current.map((cartItem) => cartItem.productId === item.productId ? { ...cartItem, notes: event.target.value } : cartItem))}
                  />
                </div>
              ))}
            </div>

            <Input
              className="min-h-11"
              aria-label={t.orderNote}
              placeholder={t.orderNotePlaceholder}
              value={orderNotes}
              onChange={(event) => setOrderNotes(event.target.value)}
            />
            <div className="sticky bottom-0 -mx-5 mt-4 border-t border-border/70 bg-card px-5 pb-safe-bottom pt-3">
              <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-secondary px-4 py-3 font-semibold">
                <span>{t.total}</span>
                <span className="shrink-0 font-serif text-lg tabular-nums text-primary">{formatVND(cartTotal)}</span>
              </div>
              <Button className="w-full active:scale-[0.98]" size="lg" onClick={submitOrder} disabled={submitting || cart.length === 0}>
                {submitting && <LoaderCircle className="animate-spin" />}
                {submitting ? t.sendingKitchen : t.confirmOrder.replace('{total}', formatVND(cartTotal))}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Bottom stack lives in the flex flow, so it can never cover page content. */}
        <div className="z-20 shrink-0 border-t border-border/80 bg-card shadow-[0_-10px_28px_-22px_hsl(var(--primary)/0.5)]">
          <AnimatePresence initial={false}>
            {cartCount > 0 && !cartOpen && (
              <motion.div
                key="cart-bar"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="px-3 pt-2"
              >
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="flex min-h-12 w-full items-center gap-3 rounded-xl bg-primary px-3.5 text-left text-primary-foreground shadow-layered transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={t.cartOpen.replace('{count}', String(cartCount)).replace('{total}', formatVND(cartTotal))}
                >
                  <span className="grid h-7 min-w-7 place-items-center rounded-full bg-primary-foreground px-1.5 text-xs font-bold tabular-nums text-primary">{cartCount}</span>
                  <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">{t.yourCart}</span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">{formatVND(cartTotal)}</span>
                  <ChevronUp className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === "chat" && (
            <form className="flex items-center gap-2 border-b border-border/70 px-3 py-2" onSubmit={handleSendChat}>
              <Input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder={t.messageStaffPlaceholder} aria-label={t.messageStaffLabel} className="min-h-11" />
              <Button type="submit" size="icon" className="shrink-0" disabled={!chatInput.trim()} aria-label={t.sendMessage}>
                <Send />
              </Button>
            </form>
          )}

          <div className="flex gap-2 border-b border-border/60 px-3 py-2">
            <button
              type="button"
              onClick={() => handleCallStaff("CALL_STAFF")}
              className={cn("flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-semibold transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", pendingCallTypes.has("CALL_STAFF") ? "bg-primary/10 text-primary" : "bg-muted text-foreground hover:bg-accent")}
            >
              <ConciergeBell className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{pendingCallTypes.has("CALL_STAFF") ? t.staffCalled : t.callStaff}</span>
            </button>
            <button
              type="button"
              onClick={() => { handleCallStaff("REQUEST_BILL"); navigate("bill"); }}
              className={cn("flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-semibold transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", pendingCallTypes.has("REQUEST_BILL") ? "bg-warning/15 text-warning-foreground" : "bg-muted text-foreground hover:bg-accent")}
            >
              <BellRing className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{pendingCallTypes.has("REQUEST_BILL") ? t.processing : t.requestBill}</span>
            </button>
          </div>

          <nav className="grid grid-cols-4 gap-1 px-1.5 pb-safe-bottom pt-1.5" aria-label={t.orderNavigation}>
            {tabs.map(({ id, label, icon: Icon }) => {
              const badge = id === "orders" ? activeOrders.filter((order) => order.status === "PENDING").length : 0;
              const active = activeTab === id;
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => navigate(id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <span aria-hidden="true" className={cn("absolute inset-x-5 top-0 h-0.5 rounded-full transition-colors", active ? "bg-brass" : "bg-transparent")} />
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span className="max-w-full truncate">{label}</span>
                  {badge > 0 && (
                    <motion.span
                      key={badge}
                      initial={{ scale: 0.7 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.18, ease: EASE }}
                      className="absolute right-2 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold tabular-nums text-destructive-foreground"
                    >
                      {badge}
                    </motion.span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </MotionConfig>
  );
}
