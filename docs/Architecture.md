---
id: ARCH-001
title: Architecture Detail
version: 0.5.0
status: Stable
owner: Nischay
depends_on: [SYSTEM-001]
last_updated: 2026-08-02
---

# Architecture Detail

Expands `SYSTEM.md` with concrete file relationships. Kept separate so `SYSTEM.md` stays short enough to load by default (PRINCIPLE-006).

## Dependency graph

```
MISSION-001
   ↑
PRINCIPLES-001 ──→ FRAMEWORK-001
   ↑                    ↑
SYSTEM-001 ─────────────┘
   ↑
CLAUDE-001
   ↑
profiles/* ──→ used by every project conversation
```

Reading order for a first-time load: `MISSION` → `PRINCIPLES` → `DECISION_FRAMEWORK` → `SYSTEM` → `CLAUDE`.

## Folder responsibilities

| Folder | Owner content | Populated when |
|---|---|---|
| `configs/` | System-wide toggles (`os-config.yaml`) | Now (Phase 1) |
| `profiles/` | Personalization: skills, learning, platforms, developer prefs | Now (Phase 1) |
| `playbooks/` | Step-by-step recipes for repeatable tasks (e.g. "ship an Expo app to Play Store") | First time that task is actually done |
| `templates/` | Starter scaffolds (e.g. RN+Expo app skeleton) | First real project of that type |
| `workflows/` | Multi-step processes spanning tools (e.g. asset pipeline: Kling → optimize → import) | First time the workflow is used twice |
| `reference/` | Decisions log, tool evaluations, external research notes | Ongoing, append-only |
| `prompts/` | Reusable prompt snippets for chat-paste fallback | The second time the same prompt is written by hand in a real session |
| `docs/` | Expanded architecture detail (this file) | Now (Phase 1) |
| `assets/` | Non-text files the OS itself needs (diagrams, logos) | As needed |
| `scripts/` | Repo tooling (`validate.mjs`) | v0.5.0 |
| `.claude/` | Claude Code-native config: rules, skills, settings | v0.5.0 |

## Verification

Conventions here are enforced, not aspirational. `scripts/validate.mjs` (zero-dependency Node, run via `node scripts/validate.mjs` and on every push by `.github/workflows/validate.yml`) checks: frontmatter presence/shape on all markdown, ID uniqueness, cross-reference integrity (every cited `DECISION-*`/`EVAL-*`/`PRINCIPLE-*`/frontmatter ID must resolve), version consistency per DECISION-004, internal path existence, decision-log block format, and staleness warnings. A red validator blocks a release.

## Why folders start empty

A template or playbook written before it's been used once is a guess, not a proven recipe — it violates PRINCIPLE-009 (nothing committable that isn't real). Each of these folders fills in as a side effect of doing real project work, not as a pre-build exercise.
