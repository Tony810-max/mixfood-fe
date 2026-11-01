import { MENU_TAG_PRESENTATIONS } from "@/constants";
import { cn } from "@/lib/utils";
import type { MenuItemTag } from "@/types";

/**
 * Icon and label come from the shared menu constants; the colours are mapped to design tokens here.
 * Every variant has an opaque background so the badge stays legible over dish photos.
 */
const TAG_STYLES: Record<MenuItemTag, string> = {
  signature: "border-brass bg-primary text-primary-foreground",
  spicy: "border-spice/50 bg-card text-spice",
  recommended: "border-brass/70 bg-card text-brass-strong",
  vegetarian: "border-success/40 bg-card text-success",
  "gluten-free": "border-info/40 bg-card text-info",
  "chefs-special": "border-brass bg-secondary text-primary",
};

const TagBadge = ({ tag, lang }: { tag: MenuItemTag; lang: "en" | "vn" }) => {
  const presentation = MENU_TAG_PRESENTATIONS[tag];
  if (!presentation) return null;
  const Icon = presentation.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm",
        TAG_STYLES[tag] ?? "border-border bg-card text-foreground",
      )}
    >
      <Icon aria-hidden="true" size={12} className={tag === "signature" ? "fill-current" : ""} />
      {presentation.label[lang]}
    </span>
  );
};

export default TagBadge;
