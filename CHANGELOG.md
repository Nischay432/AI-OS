# Changelog

All notable changes to AI-OS. Semantic versioning (no date-based versions).

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
