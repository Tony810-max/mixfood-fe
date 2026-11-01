import { useSiteCopy } from "@/components/brand/copy";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LanguageToggleProps {
  variant?: "desktop" | "mobile";
}

const OPTIONS = [
  { code: "en", label: "EN" },
  { code: "vn", label: "VI" },
] as const;

/** EN / VI segmented control. The sliding thumb is the only animated part (transform only). */
const LanguageToggle = ({ variant = "desktop" }: LanguageToggleProps) => {
  const { lang, setLang } = useLanguage();
  const copy = useSiteCopy();
  const mobile = variant === "mobile";

  return (
    <div
      role="group"
      aria-label={copy.language}
      className={cn(
        "relative inline-flex items-center rounded-xl border border-border bg-secondary",
        mobile ? "p-1" : "p-0.5",
      )}
    >
      <motion.span
        aria-hidden="true"
        className={cn("absolute rounded-lg bg-card shadow-layered", mobile ? "inset-y-1 left-1 w-[calc(50%-0.25rem)]" : "inset-y-0.5 left-0.5 w-[calc(50%-0.125rem)]")}
        initial={false}
        animate={{ x: lang === "en" ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 500, damping: 36 }}
      />
      {OPTIONS.map((option) => (
        <button
          key={option.code}
          type="button"
          aria-pressed={lang === option.code}
          onClick={() => setLang(option.code)}
          className={cn(
            "relative z-10 grid place-items-center rounded-lg font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            mobile ? "min-h-11 min-w-16 px-5 text-sm" : "min-h-10 min-w-11 px-3 text-xs",
            lang === option.code ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
