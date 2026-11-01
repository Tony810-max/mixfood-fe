# Coding standards - mixfood-fe

Derived from the existing code. Where code is inconsistent, follow the pattern marked **Imitate** and do not spread the one marked **Avoid**. Do not retrofit old code unless asked.

## General
1. Read a comparable implementation first ([PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) pattern table).
2. Match naming/location of neighbors. Pages: `PascalCase` folders with `index.tsx`; feature-local `components/`, `hooks/`, `utils/` inside the page folder; shared pieces under `src/components/`. Hooks `useX`; services `x.service.ts`.
3. Imports use the `@/` alias (`src/*`). Named exports for hooks/utils; default export for lazy route pages (required by `lazy()` in `src/App.tsx`).
4. No new dependency, formatter, config or lockfile change without approval. No Prettier is configured: do not reformat files; keep your diff to the lines you change.

## TypeScript
- `strict` is off (baseline). Write new code as if strict: no new `any`, no unsafe casts, explicit prop and return types on exported APIs. Shared types go in `src/types/index.ts`.
- Do not add `eslint-disable` to silence real problems. Fix `react-hooks/exhaustive-deps` warnings in code you touch; leave baseline warnings elsewhere.

## Components
- Single responsibility, small props, composable. Presentational components do not call services; data comes through hooks (Imitate: `Menucontent.tsx` uses `useMenu`).
- Reuse `src/components/ui/*` before creating UI. Variants via `cva` + `cn()` from `src/lib/utils.ts`; never copy a component for a small visual variation.
- Do not edit `src/components/ui/*` primitives for a one-off need; wrap or pass `className`. Changing a primitive changes every page.
- Accessible by default: semantic elements, `<label>` or `aria-label`, `alt` on images, `aria-live` for async status, `role="alert"` for errors (see Menu page).

## Data and async
- Server data: `useQuery`/`useMutation` in `src/hooks/api/`, calling `src/services/*.service.ts`, which use `src/lib/axios.ts`. **Avoid** new use of `src/services/api.ts` (legacy fetch) or raw `fetch`.
- Set `staleTime` intentionally (see `useMenu`). Invalidate affected keys after mutations. Query keys are arrays starting with the domain (`['menu', ...]`).
- Disable submit while pending; reject duplicate submissions (table order uses an idempotency key in `TableOrderContext.tsx`). Clean up effects, timers and sockets (see `SupportChatbot.tsx` cleanup).
- Handle: loading, error with retry, empty/no results, disabled, success, malformed or partial API data (optional chaining, defaults). Never assume arrays or localized fields exist.

## Forms
react-hook-form + zod + `components/ui/form`. Schema in a `utils/*Schema.ts` next to the form, with a test (Imitate: `bookingSchema.ts` and `bookingSchema.test.ts`). Validation messages must be bilingual; the current hardcoded Vietnamese zod messages are **Avoid** for new schemas (use the translation system).

## Localization (mandatory)
- Every user-visible string, `title`, `placeholder`, `aria-label`, `alt` exists in EN and VI via `t.*` (`src/constants/translations.ts`) or `ui("...")` (`src/constants/ui-copy.ts`). Never inline `lang === "vn" ? ... : ...` in new code; add keys instead (Menu page does inline in places: **Avoid**).
- Format dates, currency and numbers through `src/utils/formatters.ts` and `src/hooks/useDateFormat.ts`.
- Run `pnpm lint:i18n` after any text change.

## Security and privacy
- Never read, print, log or commit secrets. Do not add logging of tokens, headers, request/response bodies or PII. New diagnostics use `src/utils/logger.ts` and contain no sensitive values. (Existing `console.log` token previews are a known P1 issue, see PROJECT_CONTEXT.)
- Env access only via `VITE_*` through `src/constants/index.ts`; nothing secret in the client bundle.
- Never render untrusted HTML (`dangerouslySetInnerHTML`) without sanitization; validate input at form boundaries and encode URLs/query parameters.
- Route guards (`ProtectedRoute`) are UX only; do not rely on them for authorization.

## Performance
Lazy-load new route pages. Use correctly sized images with `alt`, `width`/`height` or aspect-ratio classes to avoid layout shift (`aspect-[4/3]` in the Menu skeleton). Avoid duplicate requests and unneeded re-renders. Measure; do not assert scores.

## Tests
Add/extend vitest tests for new logic (schemas, helpers, reducers) and critical component behavior, following `src/pages/Careers/ApplicationForm.test.tsx`. Test names describe behavior. See [QA_TESTING.md](QA_TESTING.md).

## Dead code and cleanup
Do not delete or "tidy" the duplicates listed in PROJECT_CONTEXT unless the task is that cleanup. Do not leave debug code, commented-out blocks or magic values in your own change (extract constants to `src/constants/` or `src/utils/const.ts`).

## Money and long text (round 2)
- Money always through `formatVND` in `src/utils/formatters.ts` (number then `đ`). No inline `Intl.NumberFormat` currency.
- Dynamic text in a row: `min-w-0` + `truncate`/`break-words`; siblings `shrink-0`; grids need `grid-cols-1` or `minmax(0,1fr)`.
