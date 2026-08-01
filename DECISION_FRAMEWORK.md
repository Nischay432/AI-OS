---
id: FRAMEWORK-001
title: Decision Framework
version: 0.5.0
status: Stable
owner: Nischay
depends_on: [PRINCIPLES-001, MISSION-001]
last_updated: 2026-08-02
---

# Decision Framework

How every non-trivial technology or tool choice inside AI-OS gets made. Applies to frameworks, hosting, databases, game engines, art/AI tools, libraries — anything with a multi-week+ commitment.

## The filter (apply in order, stop at first disqualifier)

1. **Free-tier viable?** Can a real project ship on the free tier, or is the free tier a time-boxed trial? Trial-only tools fail here unless PRINCIPLE-003's justification bar is explicitly met.
2. **Maintained?** Active commits/releases in the last ~6 months, or a large enough user base that abandonment risk is low.
3. **Matches skill level?** Check `profiles/skills.yaml`. Prefer tools that extend known skills over ones that require an unrelated new stack, unless the project's whole point is learning that stack.
4. **Portable?** Can the resulting work (code, data, assets) be exported or migrated without full rebuild if the tool disappears or changes pricing?
5. **Fits the platform target?** Check `profiles/platforms.yaml` — no adding Apple-only tooling while iOS is deferred.
6. **Net token/time cost vs. alternatives?** Given two options that pass 1–5, choose the one with lower ongoing integration/maintenance cost.

If a candidate fails step 1–2, it's rejected outright regardless of how good it looks otherwise. Steps 3–6 are trade-offs, not disqualifiers — record the trade-off made, not just the winner.

## Recording a decision

Every decision that survives the filter gets a short entry (not a full doc) in `reference/decisions-log.md` (created on first use):

```
### DECISION-<n>: <short title>
- Options considered: A, B, C
- Chose: B
- Why: <1-3 sentences, tied to filter steps above>
- Reversible?: yes/no — what it'd cost to switch later
- Date: YYYY-MM-DD
```

This keeps `DECISION_FRAMEWORK.md` itself timeless — it defines *how* to decide, never *what* was decided.

Evaluations that don't end in adoption still get logged — in `reference/tool-evaluations.md`, each under a citable `EVAL-<n>` ID — because the rejection reasoning has future value.

## Anti-patterns this framework exists to prevent

- Picking a tool because a YouTube video used it this week.
- Adopting a paid subscription "just in case."
- Rewriting a working decision because a newer option launched, without re-running the filter.
- Skipping the filter for "small" decisions that quietly become load-bearing.
