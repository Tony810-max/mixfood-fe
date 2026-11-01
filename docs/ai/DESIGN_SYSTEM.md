# Design system - mixfood-fe (customer website)

Contract for all UI work. It describes the system as implemented by the premium redesign (2026-11-01). Tokens and components below are **Observed** in code unless labeled Proposed.

## Brand and tone
"Modern Thai Hospitality / Refined Tropical Editorial": ivory paper, deep basil green, brass hairlines, chili/terracotta accents, Fraunces serif headlines, generous food photography. Premium but warm and conversion-focused (book a table, browse the menu, order at the table). No clip-art, no glassmorphism, no purple/blue SaaS look, no metallic gradients. Copy is bilingual EN/VI, friendly and concise.
The palette family is shared with `../mixfood-admin-fe` (`styles/globals.css` there uses the same hues; the admin keeps quieter neutral surfaces and a basil sidebar). Change tokens in one app only after checking the other.

## Tokens (Observed)
Source of truth: `src/assets/css/index.css` (CSS variables, HSL triplets) + `tailwind.config.ts`. Use semantic classes only (`bg-background`, `bg-card`, `bg-secondary`, `bg-primary`, `text-primary-foreground`, `text-muted-foreground`, `border-border`, `text-brass-strong`, `bg-spice`...). Never raw hex/RGB or palette classes (`red-500`, `slate-800`...) in components.

| Token | Light value | Use |
| --- | --- | --- |
| background / foreground | `43 53% 96%` ivory / `70 6% 14%` charcoal | page, text (14.3:1) |
| card / popover | `43 100% 99%` warm white | surfaces |
| primary / primary-foreground | `164 40% 17%` basil / ivory | main CTA, dark sections (11.2:1); gradient end `162 34% 26%` via `.primary-action` / `.bg-primary-gradient` |
| secondary / muted / accent | `38 35% 89%` / `40 30% 91%` / `38 45% 88%` sand tints | strips, chips, hover |
| muted-foreground | `60 5% 36%` | secondary text (5.9:1 on ivory) |
| brass | `37 39% 46%` | decorative rules and icons only (3.4:1) |
| brass-strong | `36 55% 31%` | any brass TEXT (6.0:1): eyebrows, prices accents |
| spice | `10 52% 45%` + white foreground | chili highlights, spicy tags, ratings (5.1:1) |
| destructive / success / warning / info | `2 66% 39%` / `142 52% 30%` / `36 90% 42%` / `204 70% 40%` | status; always with text or icon |
| border / input / ring | `38 22% 83%` / `38 10% 52%` / `164 40% 28%` | hairlines / control borders (3.3:1) / focus (6.4:1) |
| radius | `--radius: 0.75rem` | cards `rounded-2xl`, controls `rounded-lg/xl` |
| shadow | `--shadow-layered`, `-hover` (basil-tinted) | `.shadow-layered`, `.card-lift` |
| easing | `--easing-mix: cubic-bezier(0.2,0.8,0.2,1)` | all motion |
| dark mode | `.dark` set exists (brass primary on deep basil) but no provider/toggle | do not enable unless requested |

Contrast ratios were computed from the token values (WCAG formula); re-run the check when changing a token. Fonts: Fraunces (`font-serif`, headings, optical sizing) + DM Sans (`font-body`), via Google Fonts `@import` with Vietnamese support. No third family.

## Utilities and components (Observed)
- CSS utilities in `index.css`: `.eyebrow`, `.eyebrow-on-dark`, `.brass-rule`, `.brass-ornament`, `.nav-underline`, `.card-lift`, `.skeleton-shimmer`, `.page-container`, `.surface-panel`, `.shadow-layered`.
- Brand: `src/components/brand/BrandMark.tsx` (`BrandMark`, `BrandLockup`, inline SVG monogram + wordmark); strings in `src/components/brand/copy.ts` via `useSiteCopy()` (a third copy mechanism with key parity enforced by `satisfies`; prefer adding new text to `translations.ts`/`ui-copy.ts`). NOTE: `src/components/auth/AuthLogo.tsx` still shows the existing raster emblem next to the new monogram; the owner must pick one canonical logo.
- Motion: `src/components/motion/` (`Reveal`, `Stagger`, `StaggerItem`, `useScrolled`); `MotionConfig reducedMotion="user"` wraps the app in `src/App.tsx`.
- Layout: `src/components/sections/SectionHeading.tsx`; shell in `src/components/layout/Header*` / `Footer*` (hamburger below 1024px using `ui/sheet`).
- Shared UI: `src/components/ui/*` (shadcn `default` style, restyled): `button` (variants incl. `spice`, `onDark`, `outlineOnDark`), `badge` (`brass`, `spice`, `success`, `warning`), `empty-state.tsx`, `error-state.tsx`, `native-select.tsx`, `skeleton` (shimmer), `sheet` (`hideClose`), plus `quantity-stepper`. Auth fields: `src/components/auth/AuthField.tsx`.
- `components.json` css path is still wrong (`src/index.css`; real `src/assets/css/index.css`). Do not run `shadcn add` without approval; correct the path first.

## Page rhythm (home)
Ivory hero (arched food image, brass ornament, real address/hours) -> sand strip -> warm-white specialties -> basil story section -> ivory guest voices (real Google Maps data only) -> sand "Find us" -> basil footer. Do not invent reviews, awards, dishes, prices or claims.

## Responsive (mobile-first)
Design from 320px up. QA widths: 320/375/390/430, 768, 1024, 1280/1440/1920. Rules: no horizontal page overflow, 44px touch targets, sticky bars never cover content, dialogs/sheets scroll internally, safe-area padding on bottom bars, long VI/EN names wrap or truncate with `title`. QR ordering (`/q/:token`) is phone-first: top bar (table, subtotal, online state), in-flow bottom stack (cart bar, quick actions, tab bar). The support chat launcher sits bottom-left on `/q/*` so it never covers the add-to-cart buttons.

## Required states
Loading skeleton shaped like content (`role="status"`), empty (`EmptyState`), error with retry (`ErrorState`, `role="alert"`), pending/disabled buttons, success confirmation, validation (field-level, `aria-invalid` + `aria-describedby`), long content, missing image. Imitate `src/pages/Menu/components/Menu/Menucontent.tsx` and `src/pages/TableOrder/index.tsx`.

## Motion rules
Micro 120-240ms, panels 180-320ms, reveals 350-650ms, stagger 40-90ms, opacity/transform only, once per element, no always-on parallax, never fade the LCP hero image. Hover: card -2px + shadow, image scale 1.03 inside `overflow-hidden`; press `active:scale-[0.98]`. Everything must be visible with `prefers-reduced-motion: reduce` and without scrolling.

## Accessibility (WCAG 2.2 AA target)
Landmarks, exactly one `h1` per page (verified on all public routes), labelled controls, visible focus (2px ring + offset), focus trap/Escape/return in sheets and dialogs (verified for the mobile nav), `aria-live` for async status, status never by color alone. Record automated vs manual checks.

## Design-skill orchestration
1. Inspect the current UI and the tokens above first. 2. Check [TOOLING_SKILLS.md](TOOLING_SKILLS.md); read each chosen `SKILL.md`. Skills propose directions (e.g. ui-ux-pro-max suggested navy/gold "Liquid Glass" for this brief); reconcile in favor of this document and the user's request. 3. Build with shadcn components + tokens, not detached demos. 4. Verify on representative viewports and states ([QA_TESTING.md](QA_TESTING.md)). 5. Report skills actually run ([REPORT_TEMPLATE.md](REPORT_TEMPLATE.md)).
Impeccable expects `PRODUCT.md` / `DESIGN.md` at the repo root; neither exists (Recommended to create from this file after approval).

## Round-2 rules (2026-11-02)
- **Money**: ONE helper `formatVND` in `src/utils/formatters.ts` => number then `đ`, no space (`185.000đ` VI / `185,000đ` EN). `TableOrder/helpers.ts formatVND` and `Menu/utils/const.ts formatPrice` delegate to it. Never `₫` or `VND` on amounts.
- **Hero/404**: one continuous ivory surface, no percentage-width tinted side panels (they split the background and cut through images). The hero image sits in a concentric arch frame (equal padding, same radii + padding), 404 is `flex min-h-dvh flex-col` with `main flex-1`.
- **Long content**: parent `min-w-0` + `truncate`/`break-words`, siblings `shrink-0`, grids `grid-cols-1`/`minmax(0,1fr)`; `flex-col items-center` parents need `w-full` on text children (otherwise nowrap text sizes the column, as in `ProfileHeader`).
- **Landing motion** (all gated by `prefers-reduced-motion`/`(hover:hover)`): button shine sweep (`.btn-shine`) + trailing-icon nudge (`.btn-nudge`, text-bearing sizes only); dish rows with sliding `layoutId` highlight, cross-fading image and hover-intent activation; hero arch reveal + +-16px parallax; `CountUp` (only for numbers that exist in data); `DishMarquee` (35s, pauses on hover/focus, static under reduced motion). After editing `tailwind.config.ts` RESTART the Vite dev server (it caches the config; classes silently vanish otherwise).
