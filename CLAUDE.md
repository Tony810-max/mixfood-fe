@AGENTS.md

# Claude Code specifics

Shared rules are imported above from `AGENTS.md`; do not restate them here. Open this project directory (`mixfood-fe/`) as the session root so this file and `docs/ai/` load; a session rooted at the parent `Mixfood/` folder will not load it.

- Skill discovery: use the Skill tool listing for this session. Prefer repo-scoped variants named `mixfood-fe:<skill>` over unscoped plugin skills. `design-md` and `design-taste-frontend` exist only in `.agents/skills/` and are not Skill-tool invocable in Claude; read `.agents/skills/<name>/SKILL.md` directly if you choose them. Full matrix: `docs/ai/TOOLING_SKILLS.md`.
- MCP: `/mcp` shows what is connected. Browser automation (Playwright plugin tools) is the preferred way to verify rendered UI when connected; otherwise report responsive checks as `NOT RUN`. Library docs through Context7 only when it is connected.
- Planning: use plan mode for multi-file or UI-heavy changes before editing; investigation-only requests stay read-only.
- Subagents: use `Explore` for broad read-only searches. Do not claim a subagent or skill ran unless it did.
- Hooks: `.claude/settings.local.json` registers Impeccable hooks. Do not edit it, `.claude/skills/`, `.agents/`, or `skills-lock.json` during normal tasks.
- Check instruction loading in a fresh session with `/memory` or `/context`.
