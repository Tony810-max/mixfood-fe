/**
 * MenuPage
 *
 * Displays the restaurant menu grouped by category, with a search box and a
 * scrollable row of category chips to narrow down a potentially long menu.
 * Reads menu data and cart actions from TableOrderContext.
 */

import { useMemo, useState } from 'react';
import { ImageOff, Plus, Search, X } from 'lucide-react';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useTableOrder } from './TableOrderContext';
import { formatVND } from './helpers';

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, ''); // strip Vietnamese diacritics for looser matching
}

export default function MenuPage() {
  const { t, lang } = useLanguage();
  const { menu, cart, addToCart, updateQty } = useTableOrder();
  const [query, setQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');

  const normalizedQuery = normalize(query.trim());

  const categoriesWithItems = useMemo(
    () => menu.filter((c) => c.products.some((p) => p.isActive)),
    [menu],
  );

  const filteredMenu = useMemo(() => {
    return menu
      .map((category) => ({
        ...category,
        products: category.products.filter((p) => {
          if (!p.isActive) return false;
          if (activeCategoryId !== 'all' && String(category.id) !== activeCategoryId) return false;
          if (!normalizedQuery) return true;
          const name = p.name.vn || p.name.en || '';
          return normalize(name).includes(normalizedQuery);
        }),
      }))
      .filter((category) => category.products.length > 0);
  }, [menu, normalizedQuery, activeCategoryId]);

  const isEmpty = filteredMenu.length === 0;
  const productName = (product: { name: { vn?: string; en?: string } }) => lang === 'vn' ? product.name.vn || product.name.en : product.name.en || product.name.vn;
  const categoryName = (category: { name: { vn?: string; en?: string } }) => lang === 'vn' ? category.name.vn || category.name.en : category.name.en || category.name.vn;

  const chipClass = (selected: boolean) =>
    cn(
      'inline-flex min-h-11 shrink-0 snap-start items-center whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
      selected
        ? 'border-primary bg-primary text-primary-foreground'
        : 'border-border bg-card text-foreground hover:bg-accent',
    );

  return (
    <div className="flex flex-col" aria-label={t.tableMenu}>
      {/* Search + category chips */}
      <div className="sticky top-0 z-10 space-y-2.5 border-b border-border/60 bg-background px-4 pb-3 pt-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            aria-label={t.searchDish}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchDish}
            className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-11 text-base text-foreground shadow-sm transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 md:text-sm [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={t.clearSearch}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {categoriesWithItems.length > 1 && (
          <div
            role="group"
            aria-label={t.category}
            className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 py-0.5 scroll-px-4"
          >
            <button type="button" aria-pressed={activeCategoryId === 'all'} onClick={() => setActiveCategoryId('all')} className={chipClass(activeCategoryId === 'all')}>
              {t.allCategories}
            </button>
            {categoriesWithItems.map((category) => (
              <button
                key={category.id}
                type="button"
                aria-pressed={activeCategoryId === String(category.id)}
                onClick={() => setActiveCategoryId(String(category.id))}
                className={chipClass(activeCategoryId === String(category.id))}
              >
                {categoryName(category)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-7 p-4 pt-4" aria-live="polite">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <Search className="mb-3 h-10 w-10 text-brass-strong opacity-70" aria-hidden="true" />
            <p className="text-sm">{t.noMatchingDishes}</p>
            {(query || activeCategoryId !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setActiveCategoryId('all');
                }}
                className="mt-3 inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t.clearFilters}
              </button>
            )}
          </div>
        ) : (
          filteredMenu.map((category) => (
            <section key={category.id} aria-labelledby={`menu-cat-${category.id}`}>
              <h2 id={`menu-cat-${category.id}`} className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brass-strong">
                <span className="min-w-0 break-words [overflow-wrap:anywhere]">{categoryName(category)}</span>
                <span aria-hidden="true" className="h-px min-w-6 flex-1 bg-brass/40" />
              </h2>
              <ul className="space-y-2.5">
                {category.products.map((product) => {
                  const cartItem = cart.find((c) => c.productId === product.id);
                  const name = productName(product) || t.unnamedDish;
                  return (
                    <li
                      key={product.id}
                      className={cn(
                        'flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-layered transition-[border-color,box-shadow] duration-200',
                        cartItem ? 'border-primary/50' : 'border-border/80',
                      )}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={productName(product) || t.dish}
                          loading="lazy"
                          decoding="async"
                          width={80}
                          height={80}
                          className="h-20 w-20 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground" aria-hidden="true">
                          <ImageOff className="h-5 w-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 break-words text-sm font-semibold leading-snug text-foreground [overflow-wrap:anywhere]" title={name}>
                          {name}
                        </p>
                        <p className="mt-1 font-serif text-base font-semibold tabular-nums text-primary">
                          {formatVND(product.price)}
                        </p>
                      </div>
                      {cartItem ? (
                        <QuantityStepper
                          className="h-11 shrink-0"
                          value={cartItem.quantity}
                          onChange={(qty) => updateQty(product.id, qty)}
                          max={99}
                        />
                      ) : (
                        <button
                          type="button"
                          aria-label={t.addToCart.replace('{item}', name)}
                          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-[transform,background-color] hover:bg-primary/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          onClick={() => addToCart(product)}
                        >
                          <Plus className="h-5 w-5" aria-hidden="true" />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
