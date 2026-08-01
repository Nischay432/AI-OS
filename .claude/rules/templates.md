---
paths: ["templates/**"]
---

# Template rules

- Templates are convention starters, not apps — they assume their generator command (see each README's Setup) has already run.
- Any edit to a template must keep its README's Setup commands copy-paste reproducible (no interactive flags).
- The Godot starter's boot string must stay identical in `scenes/main.tscn`, `scripts/main.gd`, and the README verification step — `scripts/validate.mjs` checks the .gd/README pair.
- A template only graduates to a `playbooks/` entry after a project built from it actually ships (see each README's graduation trigger).
