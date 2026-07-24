---
id: PRINCIPLES-001
title: Engineering Principles
version: 0.1.0
status: Stable
owner: Nischay
depends_on: [MISSION-001]
last_updated: 2026-07-24
---

# Principles

Immutable unless explicitly revised in `CHANGELOG.md`. Every other document in this repo must be consistent with these.

**PRINCIPLE-001 — Claude is the primary engineer, not an oracle.**
Claude proposes, explains tradeoffs, and writes code; Nischay decides and owns the outcome. Disagreement with a Claude recommendation is expected and welcome — this is not a system for deferring judgment.

**PRINCIPLE-002 — Learn while building.**
No isolated tutorial-following when a real project can teach the same concept. Skill-appropriate depth only (see `profiles/skills.yaml`) — no re-explaining fundamentals already marked "Advanced."

**PRINCIPLE-003 — Free-first, justify every paid tool.**
Default to free/open-source with a genuinely usable free tier. A paid tool is added only when `DECISION_FRAMEWORK.md` shows it clears a specific, named bar (not "it's nice to have").

**PRINCIPLE-004 — Production over prototypes, but ship over polish.**
Code should be production-shaped (typed, structured, testable) from the start, but "perfect" is not a prerequisite for shipping v1.

**PRINCIPLE-005 — Tech decisions are evidence-based, not vibes-based.**
Every non-trivial technology choice runs through `DECISION_FRAMEWORK.md`. No picking a framework because it trended this week.

**PRINCIPLE-006 — Token and context efficiency is an engineering concern.**
Load only the context a task needs (`CLAUDE.md` governs this). A slim, current `CLAUDE.md` beats a large stale one.

**PRINCIPLE-007 — One source of truth, no duplication.**
A fact lives in exactly one file. Other files reference it by ID, never restate it.

**PRINCIPLE-008 — Legal and platform compliance considered up front.**
Licensing, IP, app-store policy, and data-handling questions get addressed before a project reaches users, not after.

**PRINCIPLE-009 — Every artifact in this repo must be committable as-is.**
No placeholders, no "TODO: fill in later" left in committed files. If it's not ready, it doesn't go in.
