---
id: CHANGELOG-001
title: Changelog
version: 0.6.0
status: Living document
owner: Nischay
depends_on: []
last_updated: 2026-08-02
---

# Changelog

All notable changes to AI-OS. Semantic versioning (no date-based versions). The newest entry here **is** the repo version (DECISION-004).

## [0.6.0] - 2026-08-02

### Added — First real project shipped through AI-OS (Maze Rush)
- `playbooks/ship-cf-workers-multiplayer.md` (PLAY-CFSHIP-001) — the first earned playbook: hygiene checklist, resilience baseline, local multiplayer test protocol, deploy notes
- DECISION-005 (client-side fog mask), DECISION-006 (growing-tree + braid + farthest-pair maze generation), DECISION-007 (defer DO hibernation refactor), DECISION-008 (MIT license + portal-first monetization) in `reference/decisions-log.md`

### Changed
- `PHASES.md`: Phase 5's "one app has shipped" trigger is now half-met — Maze Rush shipped 2026-08-02 (game track; the Godot track remains open)

## [0.5.0] - 2026-08-02

### Added — Hardening & Claude Code integration
- `scripts/validate.mjs` — zero-dependency convention validator (frontmatter, ID uniqueness, cross-reference integrity, version consistency, path existence, decision format)
- `.github/workflows/validate.yml` — validator runs on every push/PR
- `reference/claude-code-guide.md` (REF-CCODE-001) — session continuity, memory, token management, skills/hooks/subagents, headless mode
- `.claude/settings.json`, `.claude/rules/templates.md`, `.claude/skills/log-decision/` — repo is now Claude Code-native, not just chat-paste
- `prompts/new-project-kickoff.md` (PROMPT-001), `prompts/log-a-decision.md` (PROMPT-002)
- DECISION-004 (version semantics) in `reference/decisions-log.md`

### Changed
- `ROADMAP.md` rewritten to record what actually shipped in v0.2–0.4 (old draft predicted different milestones)
- `README.md` structure tree and usage model updated (Claude Code primary, chat-paste fallback)
- `SYSTEM.md`: versioning-semantics section; loadout table now includes `reference/decisions-log.md` and a Claude Code row
- `CLAUDE.md`: Claude Code session protocol added
- `profiles/learning.yaml`: engine choice moved to currently-learning (settled per DECISION-003); asset-gen/MCP marked deferred with pointers
- `profiles/platforms.yaml`: `steam.enabled` false (deferred — encoding matches `apple_ios`)
- Frontmatter + IDs added to `CHANGELOG.md`, `reference/*`, `templates/*/README.md`; tool evaluations got citable `EVAL-00n` IDs
- Templates modernized: Tailwind v4 (CSS-first), reproducible Expo command + React Navigation install, Godot version-pin note, boot-string parity fix
- `PRINCIPLES.md`: PRINCIPLE-009 clarified (minimal-but-working ≠ placeholder)

### Removed
- `version:` key from `configs/os-config.yaml` (repo version lives in CHANGELOG only — DECISION-004)
- `templates/web-nextjs-starter/tailwind.config.ts` (obsolete under Tailwind v4)

## [0.4.0] - 2026-07-24

### Added — Phase 4: Game-dev scaffold
- `templates/game-godot-starter/` upgraded to a real, boot-able Godot 4 project (`project.godot`, `scenes/main.tscn`, `scripts/main.gd`)
- Repo-level `.gitignore` for Godot/Node build artifacts

### Notes
- `game_dev` skill level remains `None` in `profiles/skills.yaml` — this scaffold proves the pipeline boots, it isn't "having built a game." That distinction stays until real mechanics exist.
- Phase 5 (v1.0.0 consolidation) is blocked on a real shipped app + game — see `PHASES.md` for why it can't be pre-built.

## [0.3.0] - 2026-07-24

### Added — Phase 3: AI tool ecosystem evaluation
- `reference/tool-evaluations.md` — NotebookLM, Google Flow, Kling AI, Higgsfield AI, Runway ML, Luma Dream Machine, Seedance evaluated against `DECISION_FRAMEWORK.md`

### Outcome
- NotebookLM adopted for research use (real free tier)
- All AI video-gen tools rejected as standing subscriptions (watermarked/testing-only free tiers, expensive and volatile paid tiers) — standing rule set: pay per-clip via cheapest aggregator only when a shipped project needs a real asset
- MCP dev-flow ecosystem (GitHub/Figma) deferred — no current task requires it

## [0.2.0] - 2026-07-24

### Added — Phase 2: Cross-domain foundations
- `reference/decisions-log.md` with DECISION-001 (web stack), DECISION-002 (app stack), DECISION-003 (game engine: Godot 4)
- `templates/web-nextjs-starter/` — Next.js + TypeScript + Tailwind scaffold
- `templates/app-expo-rn-starter/` — Expo + TypeScript + RTK Query scaffold
- `templates/game-godot-starter/` — structure guide (not a code scaffold — see PRINCIPLE-009)

### Notes
- Web and app stacks were logged retroactively since they were already proven via real work (FlyCT). Game engine was decided fresh through `DECISION_FRAMEWORK.md`.
- `playbooks/` remains empty by design — populated the first time a project from these templates actually ships.

## [0.1.0] - 2026-07-24

### Added — Phase 1: Core + Intelligence foundation
- `README.md`, `MISSION.md`, `PRINCIPLES.md`, `DECISION_FRAMEWORK.md`, `SYSTEM.md`, `docs/Architecture.md`
- `CLAUDE.md` — Claude operating manual
- `profiles/developer.yaml`, `profiles/skills.yaml`, `profiles/learning.yaml`, `profiles/platforms.yaml`
- `configs/os-config.yaml`
- `LICENSE` (MIT)
- `PHASES.md` — phase map and what's next
- Folder scaffold: `playbooks/`, `templates/`, `workflows/`, `reference/`, `assets/`, `prompts/` (empty, intentionally — see `docs/Architecture.md`)

### Established
- Three-layer model: Core / Intelligence / Knowledge
- Free-first, evidence-based decision framework
- ID-based cross-referencing convention for all docs
- Context-loading rules (load only what a task needs)
