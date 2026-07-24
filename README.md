---
id: README-001
title: AI-OS
version: 0.1.0
status: Stable
owner: Nischay
depends_on: []
last_updated: 2026-07-24
---

# AI-OS

A personal engineering operating system for Nischay — SDE 1, UI Team, FlyCT (Cleartrip Arabia / Flyin). Frontend background: React, Next.js, TypeScript, React Native (Expo), Tailwind, MUI, RTK Query.

AI-OS is not a tutorial archive or a tool list. It's a versioned repository that governs how Claude (and any other model) should think, decide, and build alongside Nischay across every future app and game project.

## What this solves

Without a system, every new project restarts from zero: re-explaining skill level, re-litigating tech choices, re-establishing what "done" looks like. AI-OS fixes that by making decisions and context persistent, versioned, and referenceable by ID instead of re-typed per conversation.

## How it's used

1. Open a new chat, paste `CLAUDE.md` + the relevant `profiles/*.yaml` as context.
2. State the project or problem.
3. Claude answers using `DECISION_FRAMEWORK.md` for tech choices and `PRINCIPLES.md` as constraints.
4. Anything reusable that comes out of the conversation (a playbook, a template, a decision) gets committed back into the repo.

The repo is the source of truth. The chat is disposable.

## Layers

| Layer | Changes | Contains |
|---|---|---|
| **Core** | Rarely | Mission, Principles, Decision Framework, System architecture |
| **Intelligence** | Occasionally | `CLAUDE.md`, MCP strategy, context-loading rules |
| **Knowledge** | Frequently | Profiles, configs, playbooks, templates, per-project reference |

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
├── CHANGELOG.md
├── LICENSE
├── PHASES.md            # what's built, what's next
├── configs/
│   └── os-config.yaml
├── profiles/
│   ├── developer.yaml
│   ├── skills.yaml
│   ├── learning.yaml
│   └── platforms.yaml
├── docs/
│   └── Architecture.md
├── playbooks/           # populated per real project
├── templates/           # populated per real project
├── workflows/           # populated per real project
├── reference/           # populated per real project
├── prompts/             # reusable prompt snippets, populated as needed
└── assets/
```

## Versioning

Semantic versioning (`v0.1.0` → `v1.0.0`). No date-based versions. Every milestone is one commit. See `CHANGELOG.md` for history and `PHASES.md` for what's next.

## Document conventions

Every markdown file opens with frontmatter (`id`, `title`, `version`, `status`, `owner`, `depends_on`, `last_updated`). Cross-references use IDs (`PRINCIPLE-004`, `DECISION-002`), not titles, so files can be renamed without breaking links.
