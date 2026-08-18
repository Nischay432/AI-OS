---
id: REF-DECISIONS-001
title: Decisions Log
version: 0.6.2
status: Living document
owner: Nischay
depends_on: [FRAMEWORK-001]
last_updated: 2026-08-05
---

# Decisions Log

Append-only. Format defined in `DECISION_FRAMEWORK.md`. Newest at top.

---

### DECISION-013: On Record monetization model

- **Options considered:** $5–8/mo subscription (original plan), seasonal one-time packs, B2B seats sold to engineering managers, ad-supported
- **Chose:** free forever for the daily loop (capture, standup generation, weekly recap, timeline, evidence view); paid one-time packs priced to the moment of need — Promotion Packet $29, Interview Packet $29; Profile Pro ~$39/yr deferred to v2. No monthly subscription, no B2B in v1.
- **Why:** the habit is the moat, so paywalling it destroys the dataset that makes the product defensible. Both external critiques independently rejected the subscription (developers read a recurring charge on a text box as a tax) and independently rejected B2B for a solo dev with a day job — SOC2, security review and procurement are an enterprise sales motion, not a nights-and-weekends one. Economics accepted honestly: ~35 sales/mo = $1k/mo at ~2% conversion on ~1,750 visitors; realistic solo ceiling $2–5k/mo, not a rocket ship.
- **Trade-off accepted:** one-time pricing caps LTV at ~$29/customer vs. a subscription's theoretical ~$48, in exchange for matching the actual purchase trigger (review season, 2–4x/year) instead of fighting it.
- **Reversible?:** yes, cheap — pricing is config plus Stripe products; revisit trigger is evidence that a meaningful cohort logs year-round rather than seasonally.
- **Date:** 2026-08-05

---

### DECISION-012: On Record growth representation — trajectories, not proficiency scores

- **Options considered:** numeric proficiency score per skill (0–100), auto-assigned ladder level, pure evidence timeline with no growth signal, evidence-backed trajectories
- **Chose:** three trajectories per skill — Momentum (increasing/steady/fading), Expansion (what's newly entering the map), Ownership (bugfix → feature → architecture → mentoring). The touched → used → owned → taught ladder is retained but the system only *suggests* a stage with stated confidence and shows the evidence; it never auto-assigns or grades.
- **Why:** a number invites an argument the product can never win ("why am I 67 and not 71?") and turns every session into a defense of the algorithm. A pure evidence timeline is defensible but reduces the product to a git-log UI. Trajectories keep the growth signal — the emotional core of the idea — while making every claim traceable to dated evidence, so the app aggregates facts rather than issuing verdicts.
- **Trade-off accepted:** loses the single legible "score" that would have made the visual skill map instantly screenshot-able and shareable; gains trust, which the north-star metric depends on.
- **Reversible?:** yes — the extraction layer stores structured skill events either way; presentation is a view over them.
- **Date:** 2026-08-05

---

### DECISION-011: On Record evidence ingestion — OAuth-first with CLI fallback

- **Options considered:** GitHub OAuth only, local CLI only, manual entry only, source-adapter architecture with all three
- **Chose:** source-adapter architecture. GitHub OAuth is the front door; a local CLI (npm global, post-commit hook, metadata only — hash/timestamp/message/branch, never diffs or file contents) is offered **only after OAuth fails**, positioned as "Enterprise Safe Mode"; manual entry always available. Everything downstream of the adapter is identical.
- **Why:** manual-only loses outright to Notion/Obsidian/Apple Notes (blank-page problem kills the habit), so auto-drafting is non-negotiable. But enterprise IT commonly blocks third-party OAuth to corporate GitHub orgs, which would silently degrade the product into a weekend-side-project tracker — the sleeper failure mode. A CLI answers that without putting a terminal install in front of every new signup, which would destroy the funnel. Passes step 3 (Node CLI is a modest extension, not a new stack) and step 4 (adapters keep ingestion swappable).
- **Trade-off accepted:** two ingestion paths to maintain instead of one, and the CLI needs a `.devlogignore` plus a regex scrubber for credentials and ticket IDs before transmit — a leaked key in a commit message is a get-the-user-fired bug, not a cosmetic one. Also accepted: git captures roughly half the work (Slack debugging, design calls, incidents, mentoring, code review leave no commit), which is why the manual reflection field is the highest-value data in the system, not a nice-to-have.
- **Reversible?:** yes — adapters are behind one interface; the CLI can be dropped or deferred without touching the rest.
- **Date:** 2026-08-05

---

### DECISION-010: On Record stack and hosting

- **Options considered:** Next.js 15 + Neon Postgres + Prisma on Vercel; Cloudflare Workers + D1 (reusing Maze Rush infra experience); Next.js on Cloudflare via OpenNext
- **Chose:** Next.js 15 + Neon Postgres + Prisma (per DECISION-001), hosted on **Vercel Hobby during pre-revenue build and validation only**, with a mandatory hosting revisit at first dollar of revenue.
- **Why:** steps 3 and 6 dominate — Next.js/TS is Advanced in `profiles/skills.yaml` and this mirrors the shipped Nextract_LMS stack, so velocity is the only real advantage a solo dev has here; learning D1 and edge paradigms inside a three-week build window spends that advantage. The schema (entries, evidence, skill events) is relational and still evolving, which favours Postgres + Prisma over D1. **Step 1 caveat, deliberately logged:** Vercel's Hobby tier is non-commercial only and names "processing payment" as commercial use — the moment Stripe checkout goes live, Hobby is a ToS violation. Neon's and Prisma's free tiers carry no such restriction.
- **Trade-off accepted:** at monetization this forces either Vercel Pro at $20/mo (a recurring cost PRINCIPLE-003 requires justifying against actual revenue) or a hosting migration. Accepted because Next.js is portable — OpenNext deploys it to Cloudflare Workers, whose free tier permits commercial use — so the framework choice does not lock the hosting choice.
- **Reversible?:** framework: no, cheaply. Hosting: yes — that is the point of separating them. **Revisit trigger: first paying customer.**
- **Date:** 2026-08-05

---

### DECISION-009: On Record — product concept, name and positioning

- **Options considered:** name — DevOx Records, Reckords, Track Record, Reckon, RCRD, On Record; positioning — "devlog with charts" / skill-growth tracker vs. evidence-and-proof career tool
- **Chose:** **On Record**, positioned as *"never struggle to prove your impact again."* Developers' daily work is captured automatically and turned into an evidence-linked record they use at reviews, raises and interviews; growth tracking is the byproduct, not the pitch.
- **Why:** rejected *DevOx Records* — [Devoxx](https://www.devoxx.com/) is an established global developer-conference brand one letter away in the same audience, and "DevOx" reads and searches as "DevOps". Rejected *Reckords* — a misspelling taxes the only growth channel available at this scale (word of mouth). "On the record" already means *attested, verifiable, undeniable*, which is the product in an idiom people use unprompted, and it yields the off-record/on-record duality that expresses the privacy rule. Positioning validated against two independent external critiques (ChatGPT, Gemini 3.1 Pro), both of which independently concluded the growth framing is aspirational while "prove what I shipped" is an acute, recurring, monetizable pain.
- **Trade-off accepted:** two common words means weak trademark and hard SEO. Accepted deliberately — at a realistic $2–5k/mo solo ceiling, clarity in word-of-mouth beats defensibility. Ships on a `tinygridlabs.com` subdomain, so domain availability is not a constraint.
- **Locked v1 scope:** GitHub ingest, auto-drafted daily entry, reflection field, standup generator, weekly recap, searchable evidence timeline, trajectories, Promotion Packet export, analytics from first commit. **Cut:** public shareable profile (deferred to v2 — four days of data is negative social proof), proficiency scores, skill radar, heatmaps, comp benchmarking, manager view, Jira/Linear, native mobile.
- **Reversible?:** name — yes, cheaply, until first public launch. Positioning — yes, but it determines pricing, landing page and build order, so churning it is expensive in practice.
- **Date:** 2026-08-05

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
