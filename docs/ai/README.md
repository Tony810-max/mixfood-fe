# AI engineering docs - mixfood-fe

Index of the instruction system for coding agents (Claude Code, Codex). Entry points: `../../AGENTS.md` (canonical) and `../../CLAUDE.md` (imports `AGENTS.md`, adds Claude-only notes).

| Doc | Open when |
| --- | --- |
| [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) | You need product scope, directory map, entry points, pattern examples, known issues |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Touching routing, providers, data fetching, auth, sockets, i18n |
| [CODING_STANDARDS.md](CODING_STANDARDS.md) | Writing or reviewing any code |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Any visual, layout, copy or component change |
| [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md) | Starting a feature, bug fix, refactor or investigation |
| [QA_TESTING.md](QA_TESTING.md) | Choosing and reporting verification |
| [TOOLING_SKILLS.md](TOOLING_SKILLS.md) | Choosing skills, MCP or plugins |
| [REPORT_TEMPLATE.md](REPORT_TEMPLATE.md) | Writing the final response |

## Conventions
- Labels used throughout: **Observed** (seen in code, path given), **Inferred** (repeated pattern), **Recommended** (not yet true), **Unknown** (needs verification).
- Paths are relative to the `mixfood-fe/` repository root unless stated.
- Existing human docs are linked, not copied: `README.md`, `REFACTOR_NOTES.md` (historical), `docs/AXIOS_TANSTACK_QUERY_MIGRATION.md` (partly stale), `docs/localization-audit.md`, `docs/recruitment-seo.md`.
- Sibling project `../mixfood-admin-fe/` (admin dashboard) has the same doc skeleton; palette and brand are shared, stack and conventions differ. Do not copy rules between them without checking.

## Maintenance
- Update a doc in the same change that makes it false. Keep `AGENTS.md` under ~150 lines.
- Verify every path you add exists. Mark unverified items `Unknown` or `Recommended`.
- Do not duplicate a rule across docs; link to the owning doc.
