# Decisions Log

Append-only. Format defined in `DECISION_FRAMEWORK.md`. Newest at top.

---

### DECISION-003: Game engine

- **Options considered:** Godot 4, Unity 6, Phaser (web-only)
- **Chose:** Godot 4
- **Why:**
  - Free-tier check (step 1): Godot is MIT-licensed — no royalties, no revenue threshold, ever. Unity Personal is free only under a revenue threshold; Phaser is free but web-only, which fails the "2D and 3D, multi-platform" goal.
  - Maintained (step 2): active, large release cadence as of 2026.
  - Skill match (step 3): weakest point — GDScript is a new language (skills.yaml has game_dev at None). Accepted as a deliberate learning investment (MISSION objective 2) rather than a disqualifier, since Godot's Python-like syntax keeps the ramp short.
  - Portability (step 4): open export pipeline, no engine lock-in beyond the project files themselves.
  - Platform fit (step 5): exports natively to Web, Android, Desktop, and Steam — matches `profiles/platforms.yaml` exactly.
  - Net cost (step 6): lower long-term cost than Unity (no license-tier risk) and broader than Phaser (2D + 3D + native builds vs. web-only).
- **Trade-off accepted:** giving up direct reuse of TypeScript/JS skill in the engine layer itself (Godot uses GDScript or C#) in exchange for one free engine that covers every target in `platforms.yaml` without a wrapper (e.g. Electron) or revenue cap.
- **Reversible?:** Yes, but costly — engine choice affects project structure from day one. Revisit only if a specific project's requirements (e.g. a pure browser-only 2D game) make Phaser clearly better for that one project; this doesn't have to be exclusive.
- **Note:** Phaser remains a valid secondary choice specifically for browser-only 2D games where reusing TypeScript directly outweighs Godot's platform breadth. Not logged as rejected outright — logged as "use Godot as the default, Phaser as the exception for web-only 2D."
- **Date:** 2026-07-24

---

### DECISION-002: App (daily-use mobile) stack

- **Options considered:** React Native (Expo), Flutter, native Kotlin/Swift
- **Chose:** React Native with Expo (SDK, current), TypeScript, RTK Query
- **Why:** Already proven at Intermediate skill level through real FlyCT work (Expo SDK 56 codebase); passes free-tier (Expo's core tooling is free), maintained, and reuses the same TypeScript/RTK Query skill already at Advanced from web work — highest score on step 3 and step 6 of any alternative.
- **Trade-off accepted:** none significant — this was already the working choice, logged here retroactively so it's referenceable by ID instead of re-justified per project.
- **Reversible?:** Yes, low cost — Expo apps stay close to standard RN, migration path exists if ever needed.
- **Date:** 2026-07-24 (retroactive)

---

### DECISION-001: Web stack

- **Options considered:** Next.js, plain React + Vite, Remix
- **Chose:** Next.js, TypeScript, Tailwind CSS
- **Why:** Advanced skill level already established through FlyCT work (Flyin EJS→Next.js revamp). Passes free-tier (self-hostable, free hosting tiers exist e.g. Vercel/Netlify free plans), maintained, highest skill-match and lowest switching cost of any option.
- **Trade-off accepted:** none significant — retroactive log of an already-proven choice.
- **Reversible?:** Yes, low cost for new projects; not revisited for existing FlyCT work (out of scope for AI-OS, which governs personal projects).
- **Date:** 2026-07-24 (retroactive)
