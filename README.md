---
id: README-001
title: AI-OS
version: 0.5.0
status: Stable
owner: Nischay
depends_on: []
last_updated: 2026-08-02
---

# AI-OS

A personal engineering operating system for Nischay — SDE 1, UI Team, FlyCT (Cleartrip Arabia / Flyin). Frontend background: React, Next.js, TypeScript, React Native (Expo), Tailwind, MUI, RTK Query.

AI-OS is not a tutorial archive or a tool list. It's a versioned repository that governs how Claude (and any other model) should think, decide, and build alongside Nischay across every future app and game project.

## What this solves

Without a system, every new project restarts from zero: re-explaining skill level, re-litigating tech choices, re-establishing what "done" looks like. AI-OS fixes that by making decisions and context persistent, versioned, and referenceable by ID instead of re-typed per conversation.

## How it's used

**Primary — Claude Code:** open a session in this repo (or any project repo that imports from it). `CLAUDE.md` auto-loads; Claude reads `PHASES.md` for state and `reference/decisions-log.md` for what's settled. Sessions are named and resumable (`claude --resume <name>`); decisions get logged via `/log-decision`; `scripts/validate.mjs` gates every commit. Full mechanics: `reference/claude-code-guide.md`.

**Fallback — chat paste:** paste `CLAUDE.md` + the relevant `profiles/*.yaml` (see the loadout table in `SYSTEM.md`, and `prompts/` for ready-made prompts).

Either way: Claude answers using `DECISION_FRAMEWORK.md` for tech choices and `PRINCIPLES.md` as constraints, and anything reusable gets committed back. The repo is the source of truth. The chat is disposable.

## Layers

| Layer | Changes | Contains |
|---|---|---|
| **Core** | Rarely | Mission, Principles, Decision Framework, System architecture |
| **Intelligence** | Occasionally | `CLAUDE.md`, `.claude/` config, context-loading rules |
| **Knowledge** | Frequently | Profiles, configs, playbooks, templates, prompts, per-project reference |

## Structure

```
AI-OS/
├── README.md
├── MISSION.md
├── PRINCIPLES.md
├── DECISION_FRAMEWORK.md
├── SYSTEM.md
├── CLAUDE.md
├── ROADMAP.md
├── CHANGELOG.md          # newest entry here IS the repo version (DECISION-004)
├── PHASES.md             # what's built, what's next — read first each session
├── LICENSE
├── .claude/
│   ├── settings.json     # permission allowlist
│   ├── rules/templates.md
│   └── skills/log-decision/SKILL.md
├── .github/workflows/validate.yml
├── scripts/
│   └── validate.mjs      # convention validator — run before every commit
├── configs/
│   └── os-config.yaml
├── profiles/
│   ├── developer.yaml
│   ├── skills.yaml
│   ├── learning.yaml
│   └── platforms.yaml
├── docs/
│   └── Architecture.md
├── reference/
│   ├── decisions-log.md
│   ├── tool-evaluations.md
│   └── claude-code-guide.md
├── templates/
│   ├── web-nextjs-starter/
│   ├── app-expo-rn-starter/
│   └── game-godot-starter/
├── prompts/
│   ├── new-project-kickoff.md
│   └── log-a-decision.md
├── playbooks/            # empty until something ships (see docs/Architecture.md)
├── workflows/            # empty until a workflow is used twice
└── assets/
```

## Versioning

Semantic versioning (`v0.1.0` → `v1.0.0`). The newest `CHANGELOG.md` entry is the repo version; per-file frontmatter `version` marks when that file last materially changed (DECISION-004). See `PHASES.md` for what's next.

## Document conventions

Every markdown file opens with frontmatter (`id`, `title`, `version`, `status`, `owner`, `depends_on`, `last_updated`). Cross-references use IDs (`PRINCIPLE-004`, `DECISION-002`, `EVAL-003`), not titles, so files can be renamed without breaking links. `scripts/validate.mjs` enforces all of this.
