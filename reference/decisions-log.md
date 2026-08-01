---
id: REF-DECISIONS-001
title: Decisions Log
version: 0.6.0
status: Living document
owner: Nischay
depends_on: [FRAMEWORK-001]
last_updated: 2026-08-02
---

# Decisions Log

Append-only. Format defined in `DECISION_FRAMEWORK.md`. Newest at top.

---

### DECISION-008: Maze Rush license + monetization path

- **Options considered:** MIT (open portfolio asset), PolyForm Noncommercial, private repo with no license; monetization via Google AdSense/H5 Games Ads on own domain vs. CrazyGames/Poki portal submission
- **Chose:** MIT license; portal-first monetization (submit to CrazyGames after ship-polish), no ads on own deployment
- **Why:** client JS is always readable regardless of license — the real moat is the multiplayer backend (Durable Objects infra) plus portal first-mover, so open-sourcing costs little and the hiring value of a readable 2.3k-LOC real-time game exceeds clone risk. AdSense H5 Games Ads requires the AdSense-for-Games program with traffic minimums (≈$0 at hobby traffic); portals bring their own traffic and handle ads via SDK rev-share.
- **Reversible?:** license effectively no (MIT grants are perpetual for shipped versions); monetization path yes — portal terms are per-submission.
- **Date:** 2026-08-02

---

### DECISION-007: Defer Durable Object hibernation/alarm refactor

- **Options considered:** full WebSocket-hibernation-API rewrite with alarm-driven phase timers, status quo (in-memory setTimeout only), status quo + one durable safety alarm
- **Chose:** status quo + one durable safety alarm per round (`setAlarm(roundStart + timeLimit + 30s)` force-ends stuck rounds)
- **Why:** open sockets pin the DO in memory, so setTimeout timers only die on rare isolate restarts; the full rewrite is ~a day of risky refactor for a failure mode whose blast radius is now "round force-ends 30s late" instead of "room hangs forever."
- **Reversible?:** yes — revisit trigger: observed stalled rounds in production, or DO duration billing becoming material.
- **Date:** 2026-08-02

---

### DECISION-006: Maze generation algorithm (Maze Rush)

- **Options considered:** keep perfect-maze DFS + add mechanics (keys/doors/teleporters), Prim/Kruskal variants, growing-tree + braiding + farthest-pair endpoints + seeded PRNG
- **Chose:** growing-tree carve (windiness 0.75) + braiding (10–35% of dead ends into loops, bridging only similar-BFS-distance cells so loops don't shortcut par) + double-BFS farthest-pair start/exit + mulberry32 seed
- **Why:** the "too easy" complaint was structural — unique path, fixed corners, whole board visible. This fixes the maze itself with zero new wire messages or art, and the seed enables solo mode, replays, and deterministic tests. New mechanics deferred: they need protocol, validation, and balance work disproportionate to a first ship.
- **Reversible?:** yes — generator is a pure function behind one call site per consumer.
- **Date:** 2026-08-02

---

### DECISION-005: Fog of war — client-side mask over server visibility streaming

- **Options considered:** server streams only visible cells per player (map-hack-proof), client-side fog mask over a fully-shipped maze, hybrid (server ships maze late)
- **Chose:** client-side fog mask + camera lock; the full maze still ships in `round_start`
- **Why:** opponent positions were already server-scoped (the only leak that decides races); the reveal phase intentionally shows everyone the full maze for 5s anyway, so a map-hack yields memorization, not teleporting — moves stay server-validated. Server-side cell streaming would break optimistic movement prediction on unknown cells and roughly double the netcode for a casual game.
- **Reversible?:** yes — revisit trigger: actual map-hack abuse observed.
- **Date:** 2026-08-02

---

### DECISION-004: Version semantics

- **Options considered:** duplicate version in `configs/os-config.yaml` + frontmatter (status quo), single source in CHANGELOG with per-file change markers, mass-bump every file each release
- **Chose:** repo version = newest `CHANGELOG.md` entry; per-file frontmatter `version` = repo version at last material change
- **Why:** the status quo violated PRINCIPLE-007 (version stated in two places, already drifted 0.1.0 vs 0.4.0 by v0.4.0); mass-bumping fakes change history. This makes drift structurally impossible and is machine-checkable by `scripts/validate.mjs`.
- **Reversible?:** yes, cheap — it's a convention plus one validator rule.
- **Date:** 2026-08-02

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
