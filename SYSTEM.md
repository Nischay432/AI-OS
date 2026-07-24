---
id: SYSTEM-001
title: System Architecture
version: 0.1.0
status: Stable
owner: Nischay
depends_on: [MISSION-001, PRINCIPLES-001]
last_updated: 2026-07-24
---

# System Architecture

How AI-OS is put together and how it's meant to be loaded into a Claude conversation.

## Three layers

**Core** (`MISSION.md`, `PRINCIPLES.md`, `DECISION_FRAMEWORK.md`, `SYSTEM.md`) — the philosophy. Changes rarely, and only via a deliberate version bump with a `CHANGELOG.md` entry explaining why.

**Intelligence** (`CLAUDE.md`, this file's context-loading rules, any future MCP/tooling strategy docs) — how Claude behaves inside this system. Changes as Claude's capabilities and available tools evolve.

**Knowledge** (`profiles/`, `configs/`, `playbooks/`, `templates/`, `workflows/`, `reference/`) — the frequently-updated layer. Grows with every real project.

## Context-loading model

Not every conversation needs the whole repo. Default loadout:

| Conversation type | Load |
|---|---|
| New project kickoff | `CLAUDE.md`, `DECISION_FRAMEWORK.md`, `profiles/developer.yaml`, `profiles/skills.yaml`, `profiles/platforms.yaml` |
| Quick technical question | `CLAUDE.md` only |
| Tech/tool decision | `DECISION_FRAMEWORK.md`, `profiles/platforms.yaml` |
| Retrospective / adding a playbook | `PRINCIPLES.md`, the relevant existing `playbooks/*` |

Rule of thumb: load the smallest set of files that fully determines the answer. This is PRINCIPLE-006 in practice.

## Interaction model

A conversation using AI-OS should:
1. State which files are loaded as context (or paste them).
2. State the task.
3. Get an answer that cites the relevant ID (e.g. "per FRAMEWORK-001, step 1...") instead of re-deriving reasoning from scratch.
4. If the conversation produces something reusable (a decision, a playbook, a template), that artifact gets committed back — the chat itself is not the deliverable.

## Growth path

`playbooks/`, `templates/`, `workflows/`, and `reference/` start empty by design (Rule 9, no placeholders — an empty, unpopulated folder is honest; a placeholder file pretending to have content is not). They fill up one real project at a time. See `PHASES.md` for what populates them next.
