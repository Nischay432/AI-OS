---
id: PROMPT-002
title: Log-a-Decision Prompt
version: 0.5.0
status: Stable
owner: Nischay
depends_on: [FRAMEWORK-001]
last_updated: 2026-08-02
---

# Log-a-Decision Prompt

Chat-paste fallback for recording a decision (in Claude Code, use the `/log-decision` skill instead). Paste `DECISION_FRAMEWORK.md` + `reference/decisions-log.md`, then:

```
A decision was just made and needs logging. Details:

- What was decided: <one line>
- Options considered: <A, B, C>
- Chosen: <B>
- Key reasoning against the six filter steps: <notes>

Tasks:
1. Verify it actually passes filter steps 1–2 (hard disqualifiers) — flag if it doesn't.
2. Write the DECISION-<n> entry in the exact format from FRAMEWORK-001
   ("Recording a decision"), next contiguous number, newest-at-top.
3. Note anything in profiles/*.yaml that this decision makes stale.
```
