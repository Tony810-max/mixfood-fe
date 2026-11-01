# Project context - mixfood-fe

## Product (Observed)
Public website for **Mix Food**, a Thai restaurant at K49 Nguyen Van Thoai, Hai Chau, Da Nang (`src/utils/const.ts` `INFORMATION_RESTAURANT`). Hours 09:00-21:50. UI is bilingual EN/VI; SEO copy is Vietnamese-first (`index.html` has `lang="vi"`, `scripts/seo-pages.ts` prerenders pages).

| Feature | Exists | Where |
| --- | --- | --- |
| Home (hero, about, reviews, location map) | Yes | `src/pages/Index.tsx`, `src/components/sections/*`, `src/components/common/Location.tsx` |
| Menu browse + diacritic-insensitive search | Yes | `src/pages/Menu/`, `src/hooks/api/useMenu.ts` |
| Table booking + success page | Yes | `src/pages/Booking/`, `src/pages/BookingSuccess/` |
| Careers list/detail + application form | Yes | `src/pages/Careers/` |
| Register (OTP), login, forgot password, profile, reservation history | Yes | `src/pages/Auth/`, `src/pages/Profile/` |
| Website support chatbot (Socket.IO) | Yes | `src/components/common/SupportChatbot.tsx` |
| QR table ordering: menu, cart, orders, chat, call staff, request bill | Yes | `src/pages/TableOrder/`, `src/services/table-session.service.ts` |
| Online checkout / delivery / payment | **No** (bill is a staff request) | - |
| Multiple branches | **No** (single location) | - |
| Dark mode toggle | **No** (`.dark` tokens exist, no provider) | `src/assets/css/index.css` |
| `/reset-password`, `/privacy`, `/terms` pages | **No** (constants exist in `ROUTES`, no route) | `src/utils/const.ts` |

## Stack (Observed, from `package.json`)
React 18.3, Vite 5 + SWC, TypeScript 5.8 (`strict: false`), react-router-dom 6, TanStack Query 5, axios 1, socket.io-client 4, react-hook-form 7 + zod 3, Tailwind 3.4 (+ `tailwindcss-animate`, typography), 27 `@radix-ui/*` (shadcn), lucide-react, framer-motion 12, sonner, vitest 3 + Testing Library + jsdom, `@playwright/test` (not runnable, see issues). Package manager **pnpm** (Dockerfile uses `pnpm install --frozen-lockfile`); `bun.lock`/`bun.lockb` are stale leftovers. Node >= 20.19 (README). No Prettier, no CI (`.github/` absent).

## Directory map (Observed)
```text
src/
  main.tsx, App.tsx          # providers + ALL routes (lazy pages, one Suspense)
  pages/                     # route screens; feature-local components/hooks/utils inside each folder
    Index.tsx  Menu/  Booking/  BookingSuccess/  Careers/  Auth/{Login,Register,ForgotPassword}/
    Profile/  TableOrder/  NotFound.tsx  Reservations/ (unreachable: route redirects)
  components/
    ui/                      # shadcn primitives (+ custom quantity-stepper.tsx)
    layout/ (Header, Footer) sections/ auth/ common/ navigation/ seo/
  contexts/                  # AuthContext, LanguageContext (+useUiText), TableSessionContext
  hooks/api/                 # react-query hooks: useMenu, useAuth, useUser, useReservations
  hooks/                     # use-mobile, use-toast, useDateFormat, useForgotPassword, useReservations (duplicate name)
  services/                  # *.service.ts API calls; api.ts = legacy fetch wrapper
  lib/                       # axios.ts (main client), utils.ts (cn), validation.ts, localization.ts
  utils/                     # const.ts (ROUTES, restaurant info), formatters, logger, storage, toastHelpers
  constants/                 # index.ts (API_CONFIG, VALIDATION), translations.ts, ui-copy.ts, site.ts ...
  types/index.ts             # all shared types
  assets/                    # food photos, css/index.css (tokens), css/App.css (template leftover)
scripts/                     # seo-pages.ts (Vite plugin), audit-localization.mjs
public/                      # static assets, _redirects
docs/                        # human docs + docs/ai (this system)
```
Entry: `index.html` -> `src/main.tsx` -> `src/App.tsx`. Alias `@/*` -> `src/*` (`tsconfig.app.json`, `vite.config.ts`, `vitest`).

## Business flows and where logic lives
- **Menu**: `useMenu` -> `menu.service.ts` -> `Menucontent.tsx` (filter + search in component).
- **Booking**: `BookingForm.tsx` + `utils/bookingSchema.ts` (zod; 30-min advance rule via `VALIDATION`) -> `hooks/api/useReservations.ts` -> `reservation.service.ts`.
- **Auth**: `AuthContext` verifies token via `GET /auth/me`; tokens in `authStorage` (`src/utils/storage.ts`); 401 refresh queue in `src/lib/axios.ts`; `ProtectedRoute` guards `/profile`, `/login`, `/register`.
- **Table ordering**: `TableOrderContext.tsx` (428 lines) holds cart, order submit with idempotency key, payment request, staff call, chat; socket events `order.status_updated`, `message.received`, `payment.confirmed`, `session.closed`.

## Pattern examples to imitate (Observed)
| Need | Imitate |
| --- | --- |
| Page with data, loading skeleton, error + retry, empty state | `src/pages/Menu/components/Menu/Menucontent.tsx` |
| Reusable presentational component | `src/pages/Menu/components/CategorySection.tsx`, `src/components/ui/quantity-stepper.tsx` |
| Form + zod + mutation | `src/pages/Booking/BookingForm.tsx`, `src/pages/Booking/utils/bookingSchema.ts` |
| Complex stateful flow | `src/pages/TableOrder/index.tsx`, `TableOrderContext.tsx` |
| Query hook | `src/hooks/api/useMenu.ts` |
| Tests | `src/pages/Careers/ApplicationForm.test.tsx`, `src/pages/Booking/utils/bookingSchema.test.ts`, `src/pages/TableOrder/helpers.test.ts` |

## Environment variables (names only; never read `.env`)
`VITE_API_BASE_URL`, `VITE_WS_URL`, `VITE_SITE_URL` (see `.env.example`).

## Known issues - observed, NOT fixed by the setup task
| Sev | Finding | Evidence |
| --- | --- | --- |
| P1 | `.env` is tracked by git although `.gitignore` excludes it; contents not inspected | `git ls-files .env` |
| P1 | First 20 characters of the access token (`tokenPreview`) and stored values (`Storage.set` logs `value`) printed with `console.log` in production code; other logs print URLs/statuses (verified in `src/lib/axios.ts:54` and `src/utils/storage.ts:46`) | `src/lib/axios.ts` (13 `console.*`), `src/contexts/AuthContext.tsx` (13), `src/components/auth/ProtectedRoute.tsx` (5), `src/utils/storage.ts` (3) |
| P2 | Playwright config imports `lovable-agent-playwright-config`, not in `package.json`; no e2e specs | `playwright.config.ts`, `playwright-fixture.ts` |
| P2 | `components.json` css path `src/index.css` is wrong (real: `src/assets/css/index.css`); `shadcn add` would misplace files | `components.json` |
| P2 | `strict: false`; `@typescript-eslint/no-unused-vars` off; lint also scans `.agents/` and `.claude/` | `tsconfig.app.json`, `eslint.config.js` |
| P2 | Default language `en` while `index.html`/SEO are `vi`; zod messages hardcoded Vietnamese | `src/contexts/LanguageContext.tsx`, `bookingSchema.ts` |
| P3 | Duplicate/dead code: `hooks/useReservations.ts` vs `hooks/api/useReservations.ts`, `services/api.ts` (legacy fetch), `pages/Reservations/`, `App.css`, unused `next-themes`, commented-out `BestSellers` | `src/` |
| P3 | Stray tracked file `vite.config.ts.timestamp-*.mjs`; stale `bun.lock*` | repo root |
| P3 | README says port 5173 (config: 8080), omits `VITE_SITE_URL`; Dockerfile/compose lack `VITE_WS_URL` build arg; hosting hints for nginx, Vercel and Netlify coexist | `README.md`, `vite.config.ts`, `Dockerfile`, `vercel.json`, `public/_redirects` |

## Unknown / needs verification
Production host (Docker+nginx vs Vercel vs Netlify); `.env` contents and whether secrets were committed; whether `dev` / `feat/auth` branches diverge from `main`; backend contract beyond what services call.
