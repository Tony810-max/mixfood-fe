import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, RotateCcw, SearchX } from "lucide-react";
import heroDish from "@/assets/hero-dish.jpg";
import { useSiteCopy } from "@/components/brand/copy";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage, useUiText } from "@/contexts/LanguageContext";
import { useMenu } from "@/hooks/api/useMenu";
import { ROUTES } from "@/utils/const";
import CategorySection from "../CategorySection";
import SearchContent from "./SearchContent";

const normalizeSearch = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/\s+/g, "");

const MenuContent = () => {
  const ui = useUiText();
  const { lang, t } = useLanguage();
  const copy = useSiteCopy();
  const { data: categories, isLoading, error, refetch } = useMenu();
  const [searchParams] = useSearchParams();
  const requestedQuery = searchParams.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState(requestedQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => setSearchQuery(requestedQuery), [requestedQuery]);

  const query = normalizeSearch(searchQuery);
  const filteredCategories = (categories ?? [])
    .filter((category) => !selectedCategory || category.id === selectedCategory)
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => !query || normalizeSearch(item.name.en).includes(query) || normalizeSearch(item.name.vn).includes(query)),
    }))
    .filter((category) => category.items.length > 0);
  const count = filteredCategories.reduce((total, category) => total + category.items.length, 0);
  const clearFilters = () => { setSearchQuery(""); setSelectedCategory(null); };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 md:pt-20">
        <section aria-labelledby="menu-title" className="overflow-hidden border-b border-border bg-secondary/50">
          <div className="page-container grid grid-cols-[minmax(0,1fr)] items-center gap-8 py-12 sm:py-16 md:grid-cols-[minmax(0,1fr)_auto] md:gap-14">
            <Stagger onMount stagger={0.08} className="max-w-2xl">
              <StaggerItem>
                <p className="eyebrow mb-5 flex items-center gap-3">
                  <span aria-hidden="true" className="brass-rule w-8 shrink-0" />
                  {ui("MIX FOOD · THAI KITCHEN")}
                </p>
              </StaggerItem>
              <StaggerItem>
                <h1 id="menu-title" className="font-serif text-[clamp(2.5rem,7vw,4.25rem)] font-semibold leading-[1.05] text-foreground">
                  {t.menuTitle}
                  <span className="text-brass">.</span>
                </h1>
              </StaggerItem>
              <StaggerItem>
                <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">{t.menuSubtitle}</p>
              </StaggerItem>
              <StaggerItem>
                <p className="mt-5 inline-flex items-center gap-3 text-sm text-muted-foreground">
                  <span aria-hidden="true" className="brass-ornament" />
                  {copy.menuHint}
                </p>
              </StaggerItem>
            </Stagger>
            <div className="relative hidden w-44 p-2.5 md:block lg:w-52" aria-hidden="true">
              <span className="arch-frame pointer-events-none absolute inset-0 border border-brass/60" />
              <img
                src={heroDish}
                alt=""
                width={1024}
                height={1024}
                decoding="async"
                className="arch-shape relative aspect-[4/5] w-full object-cover shadow-layered"
              />
            </div>
          </div>
        </section>

        <div className="sticky top-16 z-30 border-b border-border bg-background shadow-layered md:top-20">
          <div className="page-container py-3">
            <div className="grid grid-cols-[minmax(0,1fr)] gap-2.5 min-[560px]:grid-cols-[minmax(0,1fr)_14rem] min-[560px]:gap-3 lg:grid-cols-[minmax(0,1fr)_16rem]">
              <SearchContent value={searchQuery} onSearchChange={setSearchQuery} />
              <div className="min-w-0">
                <label htmlFor="menu-category" className="sr-only">{copy.dishCategory}</label>
                <NativeSelect
                  id="menu-category"
                  value={selectedCategory ?? ""}
                  onChange={(event) => setSelectedCategory(event.target.value || null)}
                >
                  <option value="">{copy.allDishes}</option>
                  {categories?.map((category) => <option key={category.id} value={category.id}>{category[lang] || category.en || category.vn}</option>)}
                </NativeSelect>
              </div>
            </div>
            <p aria-live="polite" className="sr-only sm:not-sr-only sm:mt-2 sm:text-xs sm:text-muted-foreground">
              {isLoading ? t.menuLoading : error ? t.menuLoadError : <><span className="font-semibold tabular-nums text-foreground">{count}</span> {copy.dishesCount}</>}
            </p>
          </div>
        </div>

        <div className="page-container space-y-12 py-10 md:space-y-16 md:py-14">
          {isLoading ? (
            <div role="status" aria-label={t.menuLoading} className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4 xl:gap-6">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} aria-hidden="true" className="overflow-hidden rounded-2xl border border-border bg-card">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="space-y-3 p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorState
              title={t.menuLoadError}
              action={
                <Button type="button" onClick={() => void refetch()}>
                  <RotateCcw aria-hidden="true" />
                  {t.menuRetry}
                </Button>
              }
            />
          ) : filteredCategories.length ? (
            filteredCategories.map((category) => <CategorySection key={category.id + ":" + query} category={category} lang={lang} />)
          ) : (
            <EmptyState
              icon={SearchX}
              title={t.menuNoDishes}
              description={copy.noResultsHint}
              action={
                <Button type="button" variant="outline" onClick={clearFilters}>
                  {t.clearFilters}
                </Button>
              }
            />
          )}
        </div>

        <section aria-labelledby="menu-cta-title" className="page-container pb-14 md:pb-20">
          <Reveal className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl bg-primary p-7 text-primary-foreground sm:flex-row sm:items-center md:p-10">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-brass/70" />
            <div>
              <p className="eyebrow-on-dark mb-3">{ui("MIX FOOD · DA NANG")}</p>
              <h2 id="menu-cta-title" className="font-serif text-2xl font-semibold md:text-3xl">{t.menuReadyToDine}</h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-primary-foreground/80">{t.menuReadyToDineDesc}</p>
            </div>
            <Button asChild variant="onDark" size="lg" className="shrink-0">
              <Link to={ROUTES.BOOKING}>
                {t.reserveTable}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MenuContent;
