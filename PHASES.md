---
id: PHASES-001
title: Phase Map
version: 0.6.0
status: Living document
owner: Nischay
depends_on: [SYSTEM-001, ROADMAP-001]
last_updated: 2026-08-02
---

# Phase Map

Single doc to check before starting a new AI-OS session. Shows what's done and exactly what to ask for next.

## Phase 1 — Core + Intelligence foundation — ✅ DONE (v0.1.0)

Delivered: `README.md`, `MISSION.md`, `PRINCIPLES.md`, `DECISION_FRAMEWORK.md`, `SYSTEM.md`, `docs/Architecture.md`, `CLAUDE.md`, `ROADMAP.md`, `CHANGELOG.md`, `LICENSE`, all four `profiles/*.yaml`, `configs/os-config.yaml`.

This is a complete, internally consistent repo as-is. It's usable today — commit it and start pasting `CLAUDE.md` + `profiles/*` into project chats.

## Phase 2 — Cross-domain foundations — ✅ DONE (v0.2.0)

Ran generically across all three tracks (web, daily-use app, game) instead of waiting for one specific project.

Delivered:
- `reference/decisions-log.md` — DECISION-001 (web: Next.js/TS/Tailwind), DECISION-002 (app: Expo/TS/RTK Query — both logged retroactively since already proven at FlyCT), DECISION-003 (game engine: Godot 4, chosen fresh via `DECISION_FRAMEWORK.md`)
- `templates/web-nextjs-starter/` — real, usable scaffold
- `templates/app-expo-rn-starter/` — real, usable scaffold
- `templates/game-godot-starter/` — structure guide only (no fabricated engine code — game_dev skill is still `None`, so this graduates to a real scaffold on first actual Godot project, per PRINCIPLE-009)

**What's still open:** no `playbooks/` yet — those only get written after something from these templates actually ships once (see each template's README for the exact trigger).

## Phase 3 — AI tool ecosystem evaluation — ✅ DONE (v0.3.0)

Delivered:
- `reference/tool-evaluations.md` — NotebookLM, Google Flow, Kling AI, Higgsfield AI, Runway ML, Luma Dream Machine, Seedance all run through `DECISION_FRAMEWORK.md`.
- **Outcome:** NotebookLM adopted (free tier genuinely usable for research). Every video-gen tool rejected as a standing subscription — free tiers are watermarked/testing-only, paid tiers are expensive and churn constantly. Standing rule: pay per-clip via the cheapest aggregator only when a real project needs a finished asset, re-checking pricing at that time.
- MCP ecosystem (GitHub/Figma-style dev-flow connectors) not yet evaluated — no current task needs one; revisit when a project actually needs repo/design-file automation.

**What's still open:** the video-gen tools remain unadopted by design. Revisit only when a specific shipped project needs a real asset.

## Phase 4 — Game-dev scaffold — ✅ DONE (v0.4.0)

Delivered:
- `templates/game-godot-starter/` upgraded from a structure guide to a real, boot-able Godot 4 project (`project.godot`, `main.tscn`, `main.gd`) — proven-format files, not fabricated content, since Godot's project/scene formats are deterministic text formats.
- Repo-level `.gitignore` added (Godot's `.godot/`/`*.import`, Node's `node_modules/`/`.next/`/`.expo/`) so future real projects built from any of the three templates don't accidentally commit build artifacts.

**What's still open:** `game_dev` skill level in `profiles/skills.yaml` stays at `None` until you've actually opened this in the Godot editor and built something beyond the boot-check label. First real mechanic built on top of this scaffold is the trigger for `playbooks/ship-godot-<platform>.md`.

## Phase 4.5 — Hardening & Claude Code integration — ✅ DONE (v0.5.0)

Delivered:
- Version semantics settled (DECISION-004): repo version = newest CHANGELOG entry; per-file `version` = last material change. Version drift is now impossible by construction.
- `scripts/validate.mjs` + `.github/workflows/validate.yml` — every convention (frontmatter, IDs, cross-references, versions, paths, decision format) is machine-enforced on every push.
- `reference/claude-code-guide.md` (REF-CCODE-001) — session continuity, memory, token management, skills/hooks/subagents, headless mode.
- Repo is Claude Code-native: `.claude/settings.json`, path-scoped rule for `templates/`, `/log-decision` skill; chat-paste demoted to fallback (`prompts/` populated with the two earned prompts).
- Consistency pass: ROADMAP rewritten to match reality, README tree regenerated, `learning.yaml`/`platforms.yaml` de-staled, EVAL IDs added, templates modernized (Tailwind v4, reproducible Expo command, Godot pin note).

**What's still open:** nothing in this phase. Phase 5 remains the next milestone and still requires real shipping.

## Interlude — first real ship: Maze Rush (v0.6.0, 2026-08-02)

Maze Rush (Cloudflare Workers multiplayer maze race, pre-existing project) was polished and shipped through AI-OS: maze-generation overhaul (DECISION-006), true fog of war (DECISION-005), reconnect/rejoin, solo time-trial mode, MIT license + CI (DECISION-008), DO-durability deferral (DECISION-007). Produced the first earned playbook: `playbooks/ship-cf-workers-multiplayer.md` (PLAY-CFSHIP-001).

This half-fires Phase 5's trigger ("at least one app and one game have shipped"): a game has now shipped, though via the web stack rather than the Godot track, which stays open.

## Phase 5 — v1.0.0 consolidation — BLOCKED (not skippable)

**Why this one can't be done ahead of time, unlike Phases 2-4:** its trigger is "at least one app and one game have shipped using AI-OS." Phases 2-4 could be done generically because they're groundwork (stacks, tools, scaffolds) that doesn't depend on lived outcomes. Phase 5 is a *review* of what actually happened — whether `PRINCIPLES.md`/`DECISION_FRAMEWORK.md` held up, what got pruned, what surprised you. There's no real content to write yet; faking a "lessons learned" review would be exactly the kind of placeholder this repo's own PRINCIPLE-009 rules out.

**This is the honest stopping point for automated phase generation.** Everything up through v0.4.0 is groundwork; from here, progress requires you to actually build and ship something using the templates. When that happens, come back and say "Phase 5 — review AI-OS against what actually happened," and it'll be a real consolidation, not a guess.

---

**How to resume any phase in a new chat:** paste this file + `CLAUDE.md`, say which phase, and go. Don't re-explain the whole system each time — that's what Phase 1 already solved.
