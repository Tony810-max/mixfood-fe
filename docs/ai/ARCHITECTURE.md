# Architecture - mixfood-fe

Client-only SPA (Vite). No SSR, no backend in this repo; it calls a separate REST + Socket.IO backend. Build-time prerendering of selected routes is done by `scripts/seo-pages.ts`.

## Boundaries
| Layer | Responsibility | Location |
| --- | --- | --- |
| Routes + providers | Single route table, lazy pages, global providers | `src/App.tsx`, `src/utils/const.ts` (`ROUTES`) |
| Pages | Compose sections, own feature-local components/hooks/utils | `src/pages/<Feature>/` |
| Shared UI | shadcn primitives, layout, sections | `src/components/` |
| Server state | TanStack Query hooks over services | `src/hooks/api/`, `src/services/` |
| Client/global state | React context (no Redux/Zustand) | `src/contexts/` |
| HTTP | Axios instance with auth + refresh | `src/lib/axios.ts` |

Provider order in `App.tsx` (keep): ErrorBoundary > QueryClientProvider (staleTime 30s, retry 1, no refetch on focus, mutations no retry) > TableSessionProvider > AuthProvider > LanguageProvider > TooltipProvider > Sonner/BlockedUserToast > BrowserRouter (ScrollToTop, GA page views, RouteProgress, RouteMeta, SupportChatbot, then `Suspense` + `Routes`).

## Routing (Observed)
All routes live in `src/App.tsx`. Public: `/`, `/menu`, `/booking`, `/booking/success`, `/careers`, `/careers/:slug`, `/forgot-password`. Guest-only: `/login`, `/register`. Protected: `/profile`. QR flow (no auth, token in URL): `/q/:token` with children `menu`, `orders`, `chat`, `bill`. Redirects: `/tuyen-dung` -> `/careers`, `/reservations` -> `/profile?section=reservations`. `*` -> `NotFound`. A new page: add a lazy import, a `ROUTES` entry, a `<Route>`, and prerender/sitemap entries if it is public (`scripts/seo-pages.ts`, `src/constants/public-pages.ts`, `vercel.json` rewrites).

## Data flow (Observed)
- Component -> query hook (`src/hooks/api/useX.ts`, `useQuery`/`useMutation`) -> service (`src/services/x.service.ts`) -> `src/lib/axios.ts` -> backend. Query keys are inline arrays (e.g. `['menu','categories']`).
- Exceptions to know, not to copy: `src/services/api.ts` (legacy fetch wrapper), `table-session.service.ts` (own axios instance carrying the table session token), `SupportChatbot.tsx` (raw fetch, reads env directly), TableOrder flow (plain `useState`/`useEffect`, not react-query).
- Base URL from `API_CONFIG.BASE_URL` in `src/constants/index.ts` (`VITE_API_BASE_URL`, default `http://localhost:3001`).

## Auth
`AuthContext` loads the stored token and verifies with `GET /auth/me`. Storage via `src/utils/storage.ts` (`authStorage`, keys like `mixfood.access-token`). `axios.ts` injects the Bearer token, runs a single-flight `/auth/refresh-token` on 401, and forces logout for blocked users. Flows are OTP-based (`src/components/auth/OTPInput.tsx`). Client-side guard only: `ProtectedRoute` (`requireAuth` true/false). Authorization is the backend's job.

## Real-time
Socket.IO (`VITE_WS_URL`, falls back to API base). Table ordering events: `order.status_updated`, `message.received`, `payment.confirmed`, `session.closed`, handled in `TableOrderContext.tsx`. Chatbot uses its own connection.

## Forms and validation
react-hook-form + zod (`bookingSchema.ts`, `src/lib/validation.ts`), shadcn `components/ui/form.tsx`. Server errors surface through toasts (`src/utils/toastHelpers.ts`, sonner).

## i18n (Observed)
Custom, no i18next. `LanguageContext` (`useLanguage` gives `{ lang, t }`, `lang` is `"en" | "vn"`; `useUiText` gives `ui("...")`). Two copy systems: keyed `t.*` in `src/constants/translations.ts`, and `ui("Vietnamese text")` pairs in `src/constants/ui-copy.ts` (Vietnamese string is the key). Language persisted in the `lang` cookie. `pnpm lint:i18n` (`scripts/audit-localization.mjs`) enforces parity.

## Error handling
`ErrorBoundary` wraps the app; route-level Suspense fallback `RouteFallback` in `App.tsx`; per-page `isLoading`/`error` with retry (see Menu). Axios maps backend messages; blocked user triggers `BlockedUserToast`.

## SEO / analytics
`RouteMeta`, `SocialShare`, JSON-LD and sitemap through `scripts/seo-pages.ts`; GA4 page views in `App.tsx` (`window.gtag`).

## Test topology
vitest + Testing Library (`src/test/setup.ts`, 6 files / 23 tests at baseline). No e2e, no CI. See [QA_TESTING.md](QA_TESTING.md).

## Decisions to keep (do not "fix" while doing unrelated work)
- Context for the table-order flow instead of a global store.
- Lazy route pages in one `Suspense`.
- Bilingual copy via the existing two systems; do not introduce another i18n library.
- Ivory/basil/brass palette shared with the admin app (see [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)).

## Candidate improvements (Recommended, require approval)
Remove token/response logging; untrack `.env`; consolidate on `lib/axios.ts`; fix or remove Playwright config; add `typecheck` script and CI; fix `components.json` css path; add `/reset-password`, privacy and terms routes or drop the constants.
