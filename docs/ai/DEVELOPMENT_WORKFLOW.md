# Development workflow - mixfood-fe

Pipeline for every task. Scale the ceremony to the size (typo fix = Gates 0, 3, 5, 6 in one paragraph; multi-day feature = all gates). Never skip relevant verification or truthful reporting.

## Gate 0 - Understand and classify
- Type: feature / bug fix / UI change / refactor / docs / investigation-only.
- Extract objective, scope, out-of-scope, acceptance criteria, risk, unknowns.
- **Investigation-only or "do not fix yet": inspect and report root-cause evidence; make no edits.** Honor any explicit approval gate from the user.

## Gate 1 - Inspect and reproduce
- `git status --short`; read the relevant code, types, tests and a comparable implementation ([PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)).
- Bugs: reproduce first (test, browser, or logs), isolate the root cause, then state confirmed facts vs hypotheses. Add a regression test where practical.
- Check whether the surface is behind an auth, locale or QR-token precondition (`/q/:token`).

## Gate 2 - Plan and design
For anything beyond a small fix state: target files, data flow, reuse points, UI states, EN/VI copy, mobile/tablet/desktop behavior, test plan, rollback risk. UI-heavy work: follow the design-skill steps in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) and [TOOLING_SKILLS.md](TOOLING_SKILLS.md) before coding. Ask the user only when the request is ambiguous in a way code cannot answer, or the change is risky/irreversible (dependency, schema/contract, deletion, config).

## Gate 3 - Implement minimally
Follow [CODING_STANDARDS.md](CODING_STANDARDS.md). Smallest reviewable diff, no drive-by refactors, no dependency or config change without approval. Keep behavior outside scope unchanged.

## Gate 4 - Self-review the diff
Read your own diff: logic and boundaries, duplicated code, races/cleanup, accessibility, responsive impact, EN/VI parity, secrets/logging, unintended files (`git status --short`). Confirm each acceptance criterion maps to code or a test.

## Gate 5 - Verify and regress
Run the cheapest relevant checks first, then wider ([QA_TESTING.md](QA_TESTING.md)):
1. Related vitest files, then `pnpm test`.
2. `pnpm exec tsc -p tsconfig.app.json --noEmit --incremental false` and `pnpm exec eslint <changed paths>`.
3. `pnpm lint:i18n` if any text changed.
4. `pnpm build` only when build output or prerendering could be affected (it writes `dist/`).
5. UI: check mobile/tablet/desktop and required states in a browser when a browser tool is connected.
Report each as PASS / FAIL / NOT RUN / BLOCKED / manual-only. Fix failures you introduced; report baseline failures without fixing unrelated ones.

## Gate 6 - Handoff
Final answer in Vietnamese using [REPORT_TEMPLATE.md](REPORT_TEMPLATE.md). Partial or blocked work is labeled PARTIAL / BLOCKED, never DONE.

## Approval gates (always ask first)
Installing/upgrading packages or running `shadcn add`; editing `package.json`, lockfiles, `components.json`, Docker/nginx/Vercel configs; changing API contracts or env variable names; deleting files; touching `.claude/settings*.json`, `.agents/`, `.codex/`; untracking `.env`; commits, pushes, PRs.

## Bug-investigation walkthrough (investigation-only)
Reproduce -> collect evidence (file:line, logs, failing test) -> root cause with confidence level -> list candidate fixes with trade-offs -> **stop, no edits** -> report with the template, risks section filled.
