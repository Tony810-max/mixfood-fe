# QA and testing - mixfood-fe

## Baseline (measured 2026-11-01, before this setup changed anything but docs)
| Command | Result |
| --- | --- |
| `pnpm test` | PASS: 6 files, 23 tests |
| `pnpm lint:i18n` | PASS: 170 source files, 433 paired keys, 192 copy pairs |
| `pnpm exec tsc -p tsconfig.app.json --noEmit --incremental false` | PASS (loose config, `strict: false`) |
| `pnpm exec eslint src` / `pnpm lint` | 0 errors, 14 warnings (react-refresh, exhaustive-deps) |
| `pnpm build` | NOT RUN (writes `dist/`) |
| E2E | NOT AVAILABLE: `playwright.config.ts` imports `lovable-agent-playwright-config` (not installed), no specs |

Re-measure before claiming a failure is yours.

## Test selection
Prioritize business-critical flows: booking, QR table ordering (cart, submit, payment request), auth/OTP, menu load/search, careers application. Use the existing runner (vitest + Testing Library, `src/test/setup.ts`, jsdom). Add tests beside the code (`*.test.ts(x)`). Do not add test dependencies or E2E tooling without approval. Pyramid here: unit (schemas, helpers) -> component -> manual/browser checks (no automated E2E).

## Feature matrix (apply what exists)
Positive path; negative and boundary input (e.g. booking guests 1/50/51, time 30-minute lead rule); empty and malformed API data; slow and failed network with retry; expired/refused token and blocked user; duplicate submit and double click; race between socket events and refetch; keyboard-only use; page reload mid-flow (`/q/:token` session restore).

## Responsive matrix
Samples (CSS px): 320/360/375, 390/414/430, 768/820/834, 1024, 1280/1440/1920. Use a subset for small changes and the full set for layout-heavy work. Check: no horizontal scroll, no clipped or overlapping content, sticky header/filter bars (`z-30` menu bar) do not cover content, dialogs/sheets scroll internally, touch targets >= 44px, responsive images, 200% zoom, portrait and landscape. Say "browser emulation" for resized viewports; "physical device" only if one was used.

## UI state matrix
normal, loading (skeleton), empty/no results, error + retry, success, disabled/pending, partial data, long content (VI and EN), missing image.

## Accessibility
Automated (if a tool is connected) and manual are recorded separately: landmarks and heading order, labels, keyboard path and focus return, visible focus, contrast, `aria-live`/`role=alert` feedback, reduced motion. Target WCAG 2.2 AA. Never state "accessible" without listing what was checked.

## Performance
Observe user-perceived load, layout shift, request duplication, image weight; use browser tooling when present. Report numbers measured, not scores assumed.

## Security
Untrusted input and XSS surface, no secrets or tokens in code/logs/network payloads, auth redirects (`ProtectedRoute`), PII in logs. Authorization itself is backend-owned.

## Evidence required in reports
Command, scope/environment, exact counts or error line, page + viewport + browser, artifact path if a screenshot exists, limitations. `NOT RUN` with reason is valid and required when skipped.

## Release gate
No unresolved P0/P1 regression. Lower severities are listed with disposition. Setup/doc verification is not feature E2E testing; do not conflate them.

## Baseline failures
Record preexisting failures (`lint:i18n` and tsc are green; ESLint has 14 warnings) as baseline. Do not fix unrelated ones silently.

## After the premium redesign (2026-11-01)
`tsc` PASS, `eslint src` 0 errors / 14 warnings (unchanged baseline), `pnpm test` PASS 23/23, `pnpm lint:i18n` PASS (183 files), `pnpm build` PASS. Browser sweep (Playwright, mocked API): 7 public routes x 9 widths with no horizontal overflow and one h1 each; auth + QR flows at 320/390/768/1440 clean. See the redesign report for evidence and limits.

## Long-content stress test (required for UI changes)
Mock `/auth/me`, reservations, menu and the QR session with very long names, emails, notes and dish names; load Profile, Reservations, Menu, Careers and the QR tabs at 320/390/768/1440 in EN and VI and assert: no horizontal overflow (compare `scrollWidth` with `clientWidth`, not `innerWidth`), actions reachable, no `₫`/`VND` amounts, amounts match `/\d[\d.,]*đ/`. Script: `.playwright-mcp/scripts/stress-fe.js`. Use a fresh page per script: a long-lived Playwright tab can get throttled (2 fps) and make screenshots time out.
