---
id: REF-CCODE-001
title: Claude Code Operating Reference
version: 0.5.0
status: Living document
owner: Nischay
depends_on: [CLAUDE-001, SYSTEM-001]
last_updated: 2026-08-02
---

# Claude Code Operating Reference

Everything Claude Code offers that AI-OS uses: session continuity, memory, token management, extensibility, automation. Verified against docs.claude.com/claude-code on 2026-08-02 — like REF-TOOLS-001, treat specifics as stale after ~2 months and re-verify before relying on an exact flag.

This file replaces the old assumption that context must be re-pasted per chat: Claude Code auto-loads `CLAUDE.md`, persists memory, and resumes sessions. Chat-paste (PROMPT-001/002) is now the fallback, not the default.

## 1. Session continuity (moving work across chats seamlessly)

| Need | Mechanism |
|---|---|
| Resume most recent session in a directory | `claude --continue` |
| Resume a specific session | `claude --resume <name>` or `/resume` picker in-session |
| Name a session (do this at start) | `claude -n "auth-refactor"` or `/rename auth-refactor` |
| Branch to explore without losing the original | `/branch try-x` (inherits history + permission grants) |
| Cross-surface | sessions resume across CLI, desktop app, VS Code, and claude.ai/code |

- Transcripts live in `~/.claude/projects/<project>/<session-id>.jsonl`; kept 30 days by default (`cleanupPeriodDays` in settings).
- Resume restores conversation, model, permission mode — but not `--add-dir`/`--mcp-config` flags; pass those again.
- Practice for AI-OS: **name every non-trivial session after its project** so "continue the maze-rush work" is one command, zero re-explaining.

## 2. Memory (context that survives chats)

Hierarchy, loaded in order at session start:
1. `~/.claude/CLAUDE.md` — user-global (applies to every project)
2. `<repo>/CLAUDE.md` — this repo's operating manual (CLAUDE-001), team-shareable via git
3. `<repo>/CLAUDE.local.md` — personal per-repo overrides (gitignore it)
4. `<dir>/CLAUDE.md` in subdirectories — lazy-loaded when files there are read

Plus:
- **`@path/to/file` imports** inside CLAUDE.md expand at load time (max 4 hops) — how to pull a profile in without duplicating it (PRINCIPLE-007).
- **`.claude/rules/*.md`** — rules with `paths: ["glob"]` frontmatter load only when matching files are touched. This is PRINCIPLE-006 as a mechanism: instructions that don't apply cost zero tokens.
- **Auto memory** — Claude Code maintains `MEMORY.md` (+ topic files) per project under `~/.claude/projects/<project>/memory/`; first 200 lines load every session automatically. Let it accumulate; audit with `/memory`.
- Keep any CLAUDE.md **under ~200 lines** — adherence degrades beyond that.

## 3. Token management (PRINCIPLE-006 toolbox)

- `/context` — live breakdown of what's eating the window (system, CLAUDE.md, memory, skills, MCP, files). First diagnostic when a session feels heavy.
- `/compact [focus hint]` — summarize history to free space; project-root CLAUDE.md, rules and auto memory are re-injected from disk afterwards. Run it proactively at a natural boundary instead of letting auto-compact (≈90% full) pick the moment.
- `/clear` — fresh context; the old conversation stays resumable.
- `/cost` — session spend/usage.
- **Subagent delegation** is the biggest lever: research/file sweeps run in a subagent's separate context and only the conclusion returns. Never read 30 files in the main loop.
- Cache awareness: the system prompt + loaded files are cached per session; changing model/settings/CLAUDE.md mid-session invalidates it. Batch such changes.

## 4. Skills & slash commands

- Project skills: `.claude/skills/<name>/SKILL.md`; user-global: `~/.claude/skills/`.
- Frontmatter: `description` (drives auto-invocation), `disable-model-invocation: true` (user-only — use for side-effect skills like deploy/commit), `argument-hint`.
- Body supports `$ARGUMENTS`/`$1`, and `` !`shell command` `` injection.
- Only descriptions load by default; the body loads on invocation — cheap to have many.
- AI-OS ships `/log-decision` (`.claude/skills/log-decision/`).

## 5. Hooks (deterministic automation)

Configured in `settings.json` under `hooks`; run as code, not context. Events: `SessionStart`, `PreToolUse` (can block, exit 1), `PostToolUse` (can inject context), `SessionEnd`. Canonical uses: format-on-edit (PostToolUse + prettier), guardrails (PreToolUse block on dangerous commands). Keep hooks <1s; AI-OS deliberately ships none yet — add one only when a manual step has been repeated twice (same bar as playbooks).

## 6. Subagents

`.claude/agents/<name>.md` — frontmatter `name`, `description` (auto-delegation trigger), optional `tools:` restriction and `memory: project|local|user` (own persistent MEMORY.md). Fresh context per run; only final output returns to the parent. Use for anything read-heavy; restrict `tools:` for reviewer-style agents.

## 7. Settings & permissions

Precedence: managed policy → CLI flags → `.claude/settings.local.json` (personal, gitignored) → `.claude/settings.json` (committed) → `~/.claude/settings.json` (user-global).

`permissions.allow` / `deny` rules like `Bash(npm run test *)`, `Read(src/**)` cut prompt fatigue; deny wins over allow. AI-OS commits a minimal allowlist (validator + read-only git) in `.claude/settings.json`.

## 8. MCP servers

- Add: `claude mcp add [--scope user|project] [--transport http] <name> <url-or-command>`; project scope writes committed `.mcp.json`; secrets via `${ENV_VAR}` in config, never committed.
- Status/auth: `/mcp` in-session; `claude mcp list`.
- Posture unchanged from CLAUDE-001: evaluate any MCP through FRAMEWORK-001 and log an EVAL — still deferred until a project needs one (per v0.3.0).

## 9. Headless / automation

- `claude -p "prompt"` — one-shot; `--output-format json` for structured results; `--bare` skips config discovery (CI); `--allowedTools`, `--max-turns`, `--max-budget-usd` bound unattended runs.
- `-p --continue "follow-up"` chains onto the latest session.
- Combined with GitHub Actions, this enables scheduled/CI Claude runs — none adopted in AI-OS yet (no recurring need; same rule as hooks).

## 10. Safety nets

- **Checkpoints:** every prompt snapshots files; `/rewind` (or Esc Esc) restores code and/or conversation. Bash side effects and subagent edits are not checkpointed — git is the real safety net for those.
- **Plan mode** (`--permission-mode plan` or Shift+Tab): review-before-execute for risky work.
- 30-day retention on checkpoints/transcripts (`cleanupPeriodDays`).

## Quick patterns

| Goal | Do |
|---|---|
| Continue yesterday's project work | `claude --resume <session-name>` |
| Keep long session healthy | `/context`, then `/compact` at a milestone |
| Heavy research without burning main context | ask for a subagent sweep |
| Log a decision | `/log-decision` |
| Pre-commit sanity | `node scripts/validate.mjs` (CI runs it anyway) |
| Personal-only tweak in this repo | `CLAUDE.local.md` / `.claude/settings.local.json` (gitignored) |
