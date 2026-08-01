---
id: PROMPT-001
title: New Project Kickoff Prompt
version: 0.5.0
status: Stable
owner: Nischay
depends_on: [SYSTEM-001, CLAUDE-001]
last_updated: 2026-08-02
---

# New Project Kickoff Prompt

For chat-paste fallback (in Claude Code just describe the project — CLAUDE.md auto-loads). Paste the kickoff loadout per SYSTEM-001's table (`CLAUDE.md`, `DECISION_FRAMEWORK.md`, `reference/decisions-log.md`, `profiles/developer.yaml`, `profiles/skills.yaml`, `profiles/platforms.yaml`), then:

```
Context loaded: CLAUDE.md, DECISION_FRAMEWORK.md, reference/decisions-log.md,
profiles/developer.yaml, profiles/skills.yaml, profiles/platforms.yaml.

New project: <one-line description>
Target platform(s): <web / android / desktop / steam — must be enabled in platforms.yaml>
Constraints beyond the standard ones: <any, or "none">

Tasks:
1. Confirm which settled decisions apply (cite DECISION IDs) — do not re-decide them.
2. Run anything genuinely new through FRAMEWORK-001 and propose a stack.
3. Name which template (TPL-WEB-001 / TPL-APP-001 / TPL-GAME-001) this starts from.
4. List the first three concrete build steps.
```
