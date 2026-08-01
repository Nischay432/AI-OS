---
description: Log a technology/tool decision into reference/decisions-log.md in the FRAMEWORK-001 format. Use whenever a non-trivial tech choice has just been made and needs recording.
argument-hint: "<what was decided>"
---

# Log a decision

A decision needs recording: $ARGUMENTS

Steps:
1. Read `DECISION_FRAMEWORK.md` (the six filter steps and the entry format) and `reference/decisions-log.md` (current entries and numbering).
2. Verify the choice passes filter steps 1–2 (free-tier viable, maintained) — these are hard disqualifiers; stop and flag if it fails.
3. Ask for anything missing: options considered, reasoning per filter step, reversibility.
4. Append a `### DECISION-<n>: <title>` entry at the top of the log (below the frontmatter/header), next contiguous number, exact format from FRAMEWORK-001's "Recording a decision" section. Update the log's frontmatter `last_updated`.
5. Check `profiles/*.yaml` for anything this decision makes stale (e.g. a "future" item now settled) and fix it.
6. Run `node scripts/validate.mjs` to confirm the repo is still green.
