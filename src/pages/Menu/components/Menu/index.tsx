import { useRef, useState } from "react";
import { ArrowUpRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteCopy } from "@/components/brand/copy";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { MenuItem } from "@/types";
import { ROUTES } from "@/utils/const";
import { formatPrice } from "../../utils/const";
import TagBadge from "../TagBadge";

const FALLBACK_IMAGE = "/image-blank.png";

const MenuItemCard = ({ item, lang, index, categoryName }: {
  item: MenuItem;
  lang: "en" | "vn";
  index: number;
  categoryName?: string;
}) => {
  const copy = useSiteCopy();
  const [open, setOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemName = item.name[lang] || item.name.en || item.name.vn;
  const description = item.description?.[lang]?.trim()
    || item.description?.[lang === "vn" ? "en" : "vn"]?.trim();
  const detailsLabel = copy.viewDetails;

  return (
    <>
      <Reveal className="h-full" delay={Math.min(index * 0.04, 0.2)} duration={0.4} y={12}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={detailsLabel + ": " + itemName}
          aria-haspopup="dialog"
          className="group card-lift flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-layered hover:border-brass/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
            <img
              src={item.image || FALLBACK_IMAGE}
              onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = FALLBACK_IMAGE; }}
              alt={itemName}
              width={640}
              height={480}
              className="size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
            {!!item.tags?.length && (
              <div className="absolute left-2 top-2 flex max-w-[calc(100%-1rem)] flex-wrap gap-1 sm:left-3 sm:top-3">
                {item.tags.slice(0, 2).map((tag) => <TagBadge key={tag} tag={tag} lang={lang} />)}
              </div>
            )}
          </div>
          <div className="flex w-full flex-1 flex-col gap-3 p-3.5 sm:p-4">
            <span title={itemName} className="line-clamp-2 min-w-0 break-words [overflow-wrap:anywhere] font-serif text-base font-semibold leading-snug text-foreground sm:text-lg">{itemName}</span>
            <span className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
              <span className="font-serif text-base font-semibold tabular-nums text-primary sm:text-lg">{formatPrice(item.price)}</span>
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-brass-strong transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </button>
      </Reveal>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onOpenAutoFocus={(event) => { event.preventDefault(); titleRef.current?.focus({ preventScroll: true }); }}
          onCloseAutoFocus={(event) => { event.preventDefault(); triggerRef.current?.focus({ preventScroll: true }); }}
          className="w-[calc(100%-1.5rem)] max-w-4xl gap-0 overflow-hidden rounded-2xl border-0 bg-card p-0 sm:rounded-2xl [&>button]:right-3 [&>button]:top-3 [&>button]:z-10 [&>button]:grid [&>button]:h-11 [&>button]:w-11 [&>button]:place-items-center [&>button]:rounded-full [&>button]:border [&>button]:border-border [&>button]:bg-card [&>button]:opacity-100 [&>button]:shadow-sm"
        >
          <div className="grid max-h-[calc(100dvh-2rem)] grid-cols-[minmax(0,1fr)] overflow-y-auto md:grid-cols-[repeat(2,minmax(0,1fr))]">
            <div className="flex items-center justify-center bg-secondary/60 p-4 md:p-6">
              <img
                src={item.image || FALLBACK_IMAGE}
                onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = FALLBACK_IMAGE; }}
                alt={itemName}
                className="block h-auto max-h-[50dvh] w-full rounded-xl object-contain md:max-h-[70dvh]"
              />
            </div>
            <div className="flex min-w-0 flex-col p-5 sm:p-8 md:pt-14">
              <p className="eyebrow mb-3 break-words [overflow-wrap:anywhere]">{categoryName || "Mix Food"}</p>
              <DialogTitle ref={titleRef} tabIndex={-1} className="font-serif text-2xl font-semibold leading-tight focus:outline-none sm:text-3xl">{itemName}</DialogTitle>
              <p className="mt-4 break-words font-serif text-3xl font-semibold tabular-nums text-primary">{formatPrice(item.price)}</p>
              {!!item.tags?.length && (
                <div className="mt-4 flex flex-wrap gap-2">{item.tags.map((tag) => <TagBadge key={tag} tag={tag} lang={lang} />)}</div>
              )}
              <span aria-hidden="true" className="brass-rule my-6 w-12" />
              <h3 className="mb-2 font-body text-sm font-semibold">{copy.aboutDish}</h3>
              <DialogDescription className="whitespace-pre-line break-words text-sm leading-7 [overflow-wrap:anywhere]">
                {description || copy.descriptionPending}
              </DialogDescription>
              <div className="mb-6 mt-5 flex items-start gap-2.5 rounded-xl bg-secondary/70 p-3.5 text-xs leading-5 text-muted-foreground">
                <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brass-strong" />
                <p className="min-w-0 break-words">{copy.allergyNote}</p>
              </div>
              <Button asChild size="lg" className="mt-auto">
                <Link to={ROUTES.BOOKING}>
                  {copy.reserveForDish}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuItemCard;
