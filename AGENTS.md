# AGENTS.md - Mix Food customer website (`mixfood-fe`)

Canonical instructions for every coding agent (Codex, Claude Code, others). Claude imports this file from `CLAUDE.md`. Keep this file short; details live in `docs/ai/` and are opened on demand.

## Identity
Customer-facing site of Mix Food, a Thai restaurant in Da Nang (Vietnam). Bilingual EN/VI. Features that exist in code: home, menu browse/search, table booking, careers, OTP auth + profile, website support chatbot, and QR table ordering (`/q/:token`: menu, cart, orders, chat, bill). Not present: online checkout/delivery, multi-branch, dark-mode toggle.
Stack (verified): Vite 5 + React 18 + TypeScript (loose), react-router 6, TanStack Query 5, axios, react-hook-form + zod, Tailwind 3 + shadcn/ui (Radix), Socket.IO, vitest. Package manager: **pnpm**. Details: `docs/ai/PROJECT_CONTEXT.md`.

## Precedence
1. The user's explicit request, and platform safety/permission rules.
2. This file. 3. `docs/ai/*`. 4. Existing code patterns. 5. `README.md`, `REFACTOR_NOTES.md`, `docs/*.md` (may be stale; verify against code).
On conflict choose the conservative option and say so in the report. No repo document overrides tool safety rules.

## Read on demand (do not load everything)
| Task | Open |
| --- | --- |
| Any non-trivial task | `docs/ai/DEVELOPMENT_WORKFLOW.md` |
| UI, styling, layout, copy | `docs/ai/DESIGN_SYSTEM.md`, `docs/ai/CODING_STANDARDS.md`, `docs/ai/TOOLING_SKILLS.md` |
| Routing, data, auth, sockets | `docs/ai/ARCHITECTURE.md`, `docs/ai/CODING_STANDARDS.md` |
| Bug or investigation | `docs/ai/DEVELOPMENT_WORKFLOW.md`, `docs/ai/QA_TESTING.md` |
| Tests or verification | `docs/ai/QA_TESTING.md` |
| Final answer | `docs/ai/REPORT_TEMPLATE.md` |
| Index / maintenance | `docs/ai/README.md` |

## Before you change code
- Run `git status --short`; preserve unrelated, staged and untracked work. Never run destructive git commands.
- Read a comparable existing implementation first (examples in `docs/ai/PROJECT_CONTEXT.md`).
- Never read or print `.env*` (a tracked `.env` exists; treat it as secret). Use `.env.example` for variable names.

## Change policy
- Smallest maintainable diff. No unrelated refactor, rename, reformat or cleanup.
- Reuse `src/components/ui/*`, `src/hooks/*`, `src/utils/*`, `src/constants/*` before adding new ones.
- No new dependency, lockfile change, config change or `shadcn add` without explicit approval and a stated reason.
- All user-visible text must exist in EN and VI (see `docs/ai/CODING_STANDARDS.md`); run `pnpm lint:i18n`.
- Do not add `console.*` that prints tokens, PII or response bodies.
- Validate untrusted input at boundaries; never expose secrets in client code.

## UI rules (summary)
- shadcn/ui + Tailwind tokens first; no hardcoded colors, no new fonts, no redesign unless asked.
- Mobile-first. No horizontal overflow from 320px to 1920px. Handle loading, empty, error, disabled, success and long-content states.
- Target WCAG 2.2 AA: semantic landmarks, labels, visible focus, keyboard use, `prefers-reduced-motion`.
- For UI/UX work, inventory skills first (`docs/ai/TOOLING_SKILLS.md`), read each chosen `SKILL.md`, and report which were really used.

## Commands (run from this directory)
| Purpose | Command |
| --- | --- |
| Dev server (port 8080) | `pnpm dev` |
| Lint | `pnpm lint` (also scans `.agents/` and `.claude/`; for app code use `pnpm exec eslint src`) |
| Unit/component tests | `pnpm test` |
| Localization audit | `pnpm lint:i18n` |
| Typecheck (no script exists) | `pnpm exec tsc -p tsconfig.app.json --noEmit --incremental false` |
| Build | `pnpm build` (writes `dist/`; run only when needed) |
| E2E | none usable: `playwright.config.ts` imports a package that is not installed |

## Verification gates
Proportionate to task size, never skipped silently: typecheck + scoped lint + related tests; add `pnpm lint:i18n` for any text change; for UI add viewport checks (mobile/tablet/desktop) and state checks. Preexisting failures are reported as baseline, not fixed unasked.

## Final response
Vietnamese, Markdown tables, exactly the sections in `docs/ai/REPORT_TEMPLATE.md`. Use `NOT RUN` / `BLOCKED` honestly. Never claim PASS without a command result or observed evidence. Say "browser emulation" when no physical device was used.
