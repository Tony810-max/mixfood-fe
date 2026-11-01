import { Category } from "@/types";
import { useSiteCopy } from "@/components/brand/copy";
import { Reveal } from "@/components/motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import MenuItemCard from "./Menu";

const ITEMS_PER_PAGE = 12;

const pageButtonClass =
  "inline-grid min-h-11 place-items-center rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-brass hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-card";

const CategorySection = ({
  category,
  lang,
}: {
  category: Category;
  lang: "en" | "vn";
}) => {
  const { t } = useLanguage();
  const copy = useSiteCopy();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(category.items.length / ITEMS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = category.items.slice(startIndex, endIndex);
  const categoryName = category[lang] || category.en || category.vn;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById(category.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id={category.id}
      data-id={category.id}
      aria-labelledby={`${category.id}-title`}
      className="min-h-[18.75rem] scroll-mt-[13rem] sm:scroll-mt-40 md:scroll-mt-44"
    >
      <Reveal className="mb-6 flex items-center gap-3 md:mb-8 md:gap-5" duration={0.45} y={10}>
        <h2 id={`${category.id}-title`} className="min-w-0 break-words [overflow-wrap:anywhere] font-serif text-2xl font-semibold text-foreground md:text-3xl">
          {categoryName}
        </h2>
        <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-brass/50" />
        <span className="shrink-0 rounded-full border border-border bg-card px-3 py-1 text-xs tabular-nums text-muted-foreground md:text-sm">
          {category.items.length} {t.menuItems}
        </span>
      </Reveal>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4 xl:gap-6">
        {currentItems.map((item, i) => (
          <MenuItemCard
            key={item.id}
            item={item}
            lang={lang}
            index={i}
            categoryName={categoryName}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label={copy.dishPages}>
          <button
            type="button"
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
            className={pageButtonClass}
          >
            {t.menuPrevious}
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              type="button"
              key={page}
              onClick={() => handlePageChange(page)}
              aria-current={activePage === page ? "page" : undefined}
              className={cn(
                pageButtonClass,
                "w-11 px-0 tabular-nums",
                activePage === page && "border-brass bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              )}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
            className={pageButtonClass}
          >
            {t.menuNext}
          </button>
        </nav>
      )}
    </section>
  );
};

export default CategorySection;
