---
id: REF-DECISIONS-001
title: Decisions Log
version: 0.8.0
status: Living document
owner: Nischay
depends_on: [FRAMEWORK-001]
last_updated: 2026-08-22
---

# Decisions Log

Append-only. Format defined in `DECISION_FRAMEWORK.md`. Newest at top.

---

### DECISION-020: Play Store release pipeline â€” CI-built signed AAB, loud failure, boring first build

- **Options considered:** build AABs locally (no Android SDK installed); CI job with the upload keystore held as a base64 repo secret; CI with R8 minification enabled from day one; silent-fallback Gradle config that builds unsigned when signing is absent
- **Chose:** CI-only release builds (`workflow_dispatch`, never per-push) decoding the upload keystore from a GitHub secret; Play App Signing holds the app signing key; Gradle **hard-fails** any release build without signing config; R8/minification deferred to a post-launch isolated experiment even though the keep rules are already written; verification means downloading the produced AAB and `jarsigner`-verifying the certificate fingerprint, not trusting a green pipeline.
- **Why:** free-first (all tooling free), portable (keystore + secrets re-creatable anywhere), and the critique round's strongest convergent finding: a first store release should prove exactly one new thing at a time â€” signing and packaging â€” not signing + R8 + Play review simultaneously with no local way to smoke-test a release build. The silent-unsigned fallback was rejected because it turns a misnamed env var into a green build that Play rejects days later.
- **Trade-off accepted:** the keystore lives in a GitHub secret (acceptable for a solo repo with 2FA; rotating means a new upload key request to Play). Deferring R8 ships a ~5MB-larger APK for v1. Two ops gotchas are now load-bearing knowledge: PowerShell pipes append CRLF that `base64 -d` rejects (set secrets with `--body`/`printf`), and `assetlinks.json` needs three fingerprints once Play App Signing is on (debug, upload, and Google's app-signing key) or store installs lose deep links.
- **Reversible?:** yes â€” each piece (trigger, R8, secret storage) is one file edit; the upload key itself is replaceable via Play Console's upload-key reset flow.
- **Date:** 2026-08-22

---

### DECISION-019: Design rulings are adjudicated against AI critique, then re-tested against users

- **Options considered:** decide solo and ship; single AI critique pass; two independent AI critiques (different vendors) with every disagreement adjudicated and written down; user testing only
- **Chose:** for any design/monetization decision large enough to shape a build order, run two *independent* critiques from different model vendors, adjudicate each disagreement explicitly, and record the numbered rulings in a project-local design doc. **But treat a surviving ruling as a hypothesis, not a fact** â€” a ruling that both critiques endorsed still gets reverted if real usage contradicts it.
- **Why:** two vendors disagree in useful places, and being forced to adjudicate surfaces assumptions that a solo decision hides. This produced the Maze Rush monetization rulings and the Daily Maze spec, and independently killed both a subscription and a B2B motion for On Record (DECISION-011, DECISION-013) before either cost build time. The caveat is the expensive half of the lesson: the Daily Maze "fog from t=0" ruling survived two critique rounds, shipped, read as a *bug* to players because it contradicted every other mode's convention, and was reverted the next day (2026-08-15 â†’ 2026-08-16).
- **Trade-off accepted:** a critique round costs real time before any code is written, and produces confident-sounding rulings that carry no user evidence. Guard against that by dating each ruling and naming what observation would overturn it.
- **Reversible?:** yes â€” this is a process habit, not infrastructure.
- **Date:** 2026-08-16

---

### DECISION-018: Session hygiene â€” checkpoint handoffs over long-lived sessions

- **Options considered:** rely on `/compact` alone; raise the auto-compact window; manual discipline only; a size-triggered warning hook plus a handoff-writing skill
- **Chose:** a `UserPromptSubmit` hook that stats the transcript and warns once per size band, paired with a `checkpoint` skill that writes a compact handoff doc (goal, decisions and why, current state, files touched, next steps, gotchas) so work resumes in a **fresh** session instead of continuing in the old one.
- **Why:** measured, not theorized. One session left open 2026-08-11 â†’ 2026-08-18 grew to ~93 MB and accounted for roughly 60% of that week's entire token usage; re-reading accumulated history was ~67% of weighted cost. `/compact` had been run several times and was not sufficient, because each new burst of tool-heavy work (browser automation, media production, subagents) re-grew the context. This is PRINCIPLE-006 as a mechanism rather than an intention â€” and it matches the existing bar for hooks (REF-CCODE-001 Â§5: add one only after a manual step has been repeated twice).
- **Trade-off accepted:** a handoff doc is lossy by design â€” it deliberately drops the conversational path in favour of the conclusions. That is the point, but it means anything load-bearing must be written into the doc rather than left implicit in scrollback.
- **Reversible?:** yes â€” delete one hook entry and one skill directory.
- **Date:** 2026-08-18

---

### DECISION-017: First-party analytics over any third-party SDK

- **Options considered:** GA4, PostHog/Plausible, a third-party SDK of any kind, own endpoint writing to a Durable Object, no analytics
- **Chose:** own `POST /api/events` batched via `sendBeacon`, fanning out to a global stats Durable Object holding per-day counters; a small report page reads them back. Aggregates only, no session IDs, no PII, 60-day retention, and every dimension value whitelisted server-side.
- **Why:** step 1 (free-first) and step 4 (portable) both favour it, but the deciding factor is that a deliberately tiny event set â€” land, race start with a session ordinal, race finish, share â€” answers the only question that mattered (does a first race convert to a second?) with pure counter math. No consent banner, no vendor bundle, no data leaving the account.
- **Trade-off accepted:** no ad-hoc funnel exploration later â€” you can only query what you thought to count. Accepted because the alternative (a full SDK) prices in a cookie banner and a bundle-size hit to answer questions this project does not yet have. Whitelisting dimensions is not optional: unbounded values make counters a spam target.
- **Reversible?:** yes, but re-instrumenting costs a release; historical aggregates do not backfill.
- **Date:** 2026-08-16

---

### DECISION-016: Android via a Capacitor WebView wrapper

- **Options considered:** Capacitor wrapper around the existing web build, React Native rewrite, Godot port, PWA/TWA only
- **Chose:** Capacitor as a third build target over the same codebase, with debug APKs built in CI so no local Android SDK is required.
- **Why:** step 3 dominates â€” a rewrite spends the only advantage a solo dev has, and the web build already worked. Step 6 agrees: one codebase, three targets. Play Store presence was gated on retention rather than the calendar, so the cheapest viable wrapper was the right shape.
- **Trade-off accepted:** the WebView is its own platform with its own bugs, and they are not guessable from the web build. Four cost real debugging time: `window.location.origin` reports `https://localhost` inside the shell (so every shareable link must route through one canonical origin constant); CSS `env(safe-area-inset-*)` *and* the framework's injected CSS variables both proved unreliable on device, forcing a native fix that margins the WebView inside system-bar and display-cutout insets; hardware back needs explicit routing; and CI-built APKs need a checked-in debug keystore or each build's signature differs and updates refuse to install.
- **Reversible?:** yes â€” the wrapper is additive; deleting the target leaves web and portal builds untouched.
- **Date:** 2026-08-16

---

### DECISION-015: Competitive-mode runs are validated server-side by input replay

- **Options considered:** trust client-reported time, server replay of a compressed input log, full server-side simulation streamed live, no leaderboard at all
- **Chose:** the client submits a capped input log (direction + delta-time pairs); the Durable Object replays it against the same seed using the **shared** generation code, checks every move is legal and the finish was reached, and derives the official time itself. Client-claimed milliseconds are decorative.
- **Why:** on a daily-leaderboard mode the integrity *is* the product â€” an unvalidated board is worthless the day someone posts an impossible time. Replay is cheap enough to run synchronously (a 12Ã—12 BFS is microseconds), which preserves the instant "you placed #843 of 3,412" payoff that a validation queue would destroy. Sharing the generation code between client and server means one implementation, so drift is a compile error rather than a silent divergence.
- **Trade-off accepted:** the input log needs a hard cap (entry count and bytes) or it becomes an unbounded write, and a per-key storage ceiling makes any growing per-day blob a time bomb â€” dedupe tokens must be keyed per identity, not accumulated in one value. The minimum-move-interval floor rejects malformed input; it is not proof of humanity and should not be described as anti-cheat.
- **Reversible?:** yes for the storage shape; no for the wire format once clients are in the wild.
- **Date:** 2026-08-15

---

### DECISION-014: One codebase, build-time platform adapters â€” never fork screens per platform

- **Options considered:** fork the client per distribution target, runtime platform detection scattered through components, a single build-time platform module, separate repos per target
- **Chose:** one platform module resolved at build time (`web` | portal | `android`) that owns every environment difference â€” API and socket origins, the canonical share origin, external-link gating, portal SDK glue â€” and a hard rule that the wire protocol never carries cosmetic or platform state.
- **Why:** step 6 decides it. Three targets shipped inside two weeks over one codebase; forking screens would have multiplied every subsequent change by three, and runtime detection scatters the same conditional across dozens of components. Portal SDK calls no-op silently off-portal, so the web build carries no branching. Cosmetic state stays derived rather than transmitted â€” the seven visual themes are pure functions of the maze seed, so every player derives an identical world with zero protocol change.
- **Trade-off accepted:** a build matrix and per-target QA instead of one artifact, plus the discovery that portal uploaders can impose their own structure (one required a flat asset directory and root-level icons, which had to become the permanent build output rather than a post-processing step).
- **Reversible?:** yes â€” adding or dropping a target touches one module.
- **Date:** 2026-08-15

---

### DECISION-013: On Record monetization model

- **Options considered:** $5â€“8/mo subscription (original plan), seasonal one-time packs, B2B seats sold to engineering managers, ad-supported
- **Chose:** free forever for the daily loop (capture, standup generation, weekly recap, timeline, evidence view); paid one-time packs priced to the moment of need â€” Promotion Packet $29, Interview Packet $29; Profile Pro ~$39/yr deferred to v2. No monthly subscription, no B2B in v1.
- **Why:** the habit is the moat, so paywalling it destroys the dataset that makes the product defensible. Both external critiques independently rejected the subscription (developers read a recurring charge on a text box as a tax) and independently rejected B2B for a solo dev with a day job â€” SOC2, security review and procurement are an enterprise sales motion, not a nights-and-weekends one. Economics accepted honestly: ~35 sales/mo = $1k/mo at ~2% conversion on ~1,750 visitors; realistic solo ceiling $2â€“5k/mo, not a rocket ship.
- **Trade-off accepted:** one-time pricing caps LTV at ~$29/customer vs. a subscription's theoretical ~$48, in exchange for matching the actual purchase trigger (review season, 2â€“4x/year) instead of fighting it.
- **Reversible?:** yes, cheap â€” pricing is config plus Stripe products; revisit trigger is evidence that a meaningful cohort logs year-round rather than seasonally.
- **Date:** 2026-08-05

---

### DECISION-012: On Record growth representation â€” trajectories, not proficiency scores

- **Options considered:** numeric proficiency score per skill (0â€“100), auto-assigned ladder level, pure evidence timeline with no growth signal, evidence-backed trajectories
- **Chose:** three trajectories per skill â€” Momentum (increasing/steady/fading), Expansion (what's newly entering the map), Ownership (bugfix â†’ feature â†’ architecture â†’ mentoring). The touched â†’ used â†’ owned â†’ taught ladder is retained but the system only *suggests* a stage with stated confidence and shows the evidence; it never auto-assigns or grades.
- **Why:** a number invites an argument the product can never win ("why am I 67 and not 71?") and turns every session into a defense of the algorithm. A pure evidence timeline is defensible but reduces the product to a git-log UI. Trajectories keep the growth signal â€” the emotional core of the idea â€” while making every claim traceable to dated evidence, so the app aggregates facts rather than issuing verdicts.
- **Trade-off accepted:** loses the single legible "score" that would have made the visual skill map instantly screenshot-able and shareable; gains trust, which the north-star metric depends on.
- **Reversible?:** yes â€” the extraction layer stores structured skill events either way; presentation is a view over them.
- **Date:** 2026-08-05

---

### DECISION-011: On Record evidence ingestion â€” OAuth-first with CLI fallback

- **Options considered:** GitHub OAuth only, local CLI only, manual entry only, source-adapter architecture with all three
- **Chose:** source-adapter architecture. GitHub OAuth is the front door; a local CLI (npm global, post-commit hook, metadata only â€” hash/timestamp/message/branch, never diffs or file contents) is offered **only after OAuth fails**, positioned as "Enterprise Safe Mode"; manual entry always available. Everything downstream of the adapter is identical.
- **Why:** manual-only loses outright to Notion/Obsidian/Apple Notes (blank-page problem kills the habit), so auto-drafting is non-negotiable. But enterprise IT commonly blocks third-party OAuth to corporate GitHub orgs, which would silently degrade the product into a weekend-side-project tracker â€” the sleeper failure mode. A CLI answers that without putting a terminal install in front of every new signup, which would destroy the funnel. Passes step 3 (Node CLI is a modest extension, not a new stack) and step 4 (adapters keep ingestion swappable).
- **Trade-off accepted:** two ingestion paths to maintain instead of one, and the CLI needs a `.devlogignore` plus a regex scrubber for credentials and ticket IDs before transmit â€” a leaked key in a commit message is a get-the-user-fired bug, not a cosmetic one. Also accepted: git captures roughly half the work (Slack debugging, design calls, incidents, mentoring, code review leave no commit), which is why the manual reflection field is the highest-value data in the system, not a nice-to-have.
- **Reversible?:** yes â€” adapters are behind one interface; the CLI can be dropped or deferred without touching the rest.
- **Date:** 2026-08-05

---

### DECISION-010: On Record stack and hosting

- **Options considered:** Next.js 15 + Neon Postgres + Prisma on Vercel; Cloudflare Workers + D1 (reusing Maze Rush infra experience); Next.js on Cloudflare via OpenNext
- **Chose:** Next.js 15 + Neon Postgres + Prisma (per DECISION-001), hosted on **Vercel Hobby during pre-revenue build and validation only**, with a mandatory hosting revisit at first dollar of revenue.
- **Why:** steps 3 and 6 dominate â€” Next.js/TS is Advanced in `profiles/skills.yaml` and this mirrors the shipped Nextract_LMS stack, so velocity is the only real advantage a solo dev has here; learning D1 and edge paradigms inside a three-week build window spends that advantage. The schema (entries, evidence, skill events) is relational and still evolving, which favours Postgres + Prisma over D1. **Step 1 caveat, deliberately logged:** Vercel's Hobby tier is non-commercial only and names "processing payment" as commercial use â€” the moment Stripe checkout goes live, Hobby is a ToS violation. Neon's and Prisma's free tiers carry no such restriction.
- **Trade-off accepted:** at monetization this forces either Vercel Pro at $20/mo (a recurring cost PRINCIPLE-003 requires justifying against actual revenue) or a hosting migration. Accepted because Next.js is portable â€” OpenNext deploys it to Cloudflare Workers, whose free tier permits commercial use â€” so the framework choice does not lock the hosting choice.
- **Reversible?:** framework: no, cheaply. Hosting: yes â€” that is the point of separating them. **Revisit trigger: first paying customer.**
- **Date:** 2026-08-05

---

### DECISION-009: On Record â€” product concept, name and positioning

- **Options considered:** name â€” DevOx Records, Reckords, Track Record, Reckon, RCRD, On Record; positioning â€” "devlog with charts" / skill-growth tracker vs. evidence-and-proof career tool
- **Chose:** **On Record**, positioned as *"never struggle to prove your impact again."* Developers' daily work is captured automatically and turned into an evidence-linked record they use at reviews, raises and interviews; growth tracking is the byproduct, not the pitch.
- **Why:** rejected *DevOx Records* â€” [Devoxx](https://www.devoxx.com/) is an established global developer-conference brand one letter away in the same audience, and "DevOx" reads and searches as "DevOps". Rejected *Reckords* â€” a misspelling taxes the only growth channel available at this scale (word of mouth). "On the record" already means *attested, verifiable, undeniable*, which is the product in an idiom people use unprompted, and it yields the off-record/on-record duality that expresses the privacy rule. Positioning validated against two independent external critiques (ChatGPT, Gemini 3.1 Pro), both of which independently concluded the growth framing is aspirational while "prove what I shipped" is an acute, recurring, monetizable pain.
- **Trade-off accepted:** two common words means weak trademark and hard SEO. Accepted deliberately â€” at a realistic $2â€“5k/mo solo ceiling, clarity in word-of-mouth beats defensibility. Ships on a `tinygridlabs.com` subdomain, so domain availability is not a constraint.
- **Locked v1 scope:** GitHub ingest, auto-drafted daily entry, reflection field, standup generator, weekly recap, searchable evidence timeline, trajectories, Promotion Packet export, analytics from first commit. **Cut:** public shareable profile (deferred to v2 â€” four days of data is negative social proof), proficiency scores, skill radar, heatmaps, comp benchmarking, manager view, Jira/Linear, native mobile.
- **Reversible?:** name â€” yes, cheaply, until first public launch. Positioning â€” yes, but it determines pricing, landing page and build order, so churning it is expensive in practice.
- **Date:** 2026-08-05

---

### DECISION-008: Maze Rush license + monetization path

- **Options considered:** MIT (open portfolio asset), PolyForm Noncommercial, private repo with no license; monetization via Google AdSense/H5 Games Ads on own domain vs. CrazyGames/Poki portal submission
- **Chose:** MIT license; portal-first monetization (submit to CrazyGames after ship-polish), no ads on own deployment
- **Why:** client JS is always readable regardless of license â€” the real moat is the multiplayer backend (Durable Objects infra) plus portal first-mover, so open-sourcing costs little and the hiring value of a readable 2.3k-LOC real-time game exceeds clone risk. AdSense H5 Games Ads requires the AdSense-for-Games program with traffic minimums (â‰ˆ$0 at hobby traffic); portals bring their own traffic and handle ads via SDK rev-share.
- **Reversible?:** license effectively no (MIT grants are perpetual for shipped versions); monetization path yes â€” portal terms are per-submission.
- **Date:** 2026-08-02

---

### DECISION-007: Defer Durable Object hibernation/alarm refactor

- **Options considered:** full WebSocket-hibernation-API rewrite with alarm-driven phase timers, status quo (in-memory setTimeout only), status quo + one durable safety alarm
- **Chose:** status quo + one durable safety alarm per round (`setAlarm(roundStart + timeLimit + 30s)` force-ends stuck rounds)
- **Why:** open sockets pin the DO in memory, so setTimeout timers only die on rare isolate restarts; the full rewrite is ~a day of risky refactor for a failure mode whose blast radius is now "round force-ends 30s late" instead of "room hangs forever."
- **Reversible?:** yes â€” revisit trigger: observed stalled rounds in production, or DO duration billing becoming material.
- **Date:** 2026-08-02

---

### DECISION-006: Maze generation algorithm (Maze Rush)

- **Options considered:** keep perfect-maze DFS + add mechanics (keys/doors/teleporters), Prim/Kruskal variants, growing-tree + braiding + farthest-pair endpoints + seeded PRNG
- **Chose:** growing-tree carve (windiness 0.75) + braiding (10â€“35% of dead ends into loops, bridging only similar-BFS-distance cells so loops don't shortcut par) + double-BFS farthest-pair start/exit + mulberry32 seed
- **Why:** the "too easy" complaint was structural â€” unique path, fixed corners, whole board visible. This fixes the maze itself with zero new wire messages or art, and the seed enables solo mode, replays, and deterministic tests. New mechanics deferred: they need protocol, validation, and balance work disproportionate to a first ship.
- **Reversible?:** yes â€” generator is a pure function behind one call site per consumer.
- **Date:** 2026-08-02

---

### DECISION-005: Fog of war â€” client-side mask over server visibility streaming

- **Options considered:** server streams only visible cells per player (map-hack-proof), client-side fog mask over a fully-shipped maze, hybrid (server ships maze late)
- **Chose:** client-side fog mask + camera lock; the full maze still ships in `round_start`
- **Why:** opponent positions were already server-scoped (the only leak that decides races); the reveal phase intentionally shows everyone the full maze for 5s anyway, so a map-hack yields memorization, not teleporting â€” moves stay server-validated. Server-side cell streaming would break optimistic movement prediction on unknown cells and roughly double the netcode for a casual game.
- **Reversible?:** yes â€” revisit trigger: actual map-hack abuse observed.
- **Date:** 2026-08-02

---

### DECISION-004: Version semantics

- **Options considered:** duplicate version in `configs/os-config.yaml` + frontmatter (status quo), single source in CHANGELOG with per-file change markers, mass-bump every file each release
- **Chose:** repo version = newest `CHANGELOG.md` entry; per-file frontmatter `version` = repo version at last material change
- **Why:** the status quo violated PRINCIPLE-007 (version stated in two places, already drifted 0.1.0 vs 0.4.0 by v0.4.0); mass-bumping fakes change history. This makes drift structurally impossible and is machine-checkable by `scripts/validate.mjs`.
- **Reversible?:** yes, cheap â€” it's a convention plus one validator rule.
- **Date:** 2026-08-02

---

### DECISION-003: Game engine

- **Options considered:** Godot 4, Unity 6, Phaser (web-only)
- **Chose:** Godot 4
- **Why:**
  - Free-tier check (step 1): Godot is MIT-licensed â€” no royalties, no revenue threshold, ever. Unity Personal is free only under a revenue threshold; Phaser is free but web-only, which fails the "2D and 3D, multi-platform" goal.
  - Maintained (step 2): active, large release cadence as of 2026.
  - Skill match (step 3): weakest point â€” GDScript is a new language (skills.yaml has game_dev at None). Accepted as a deliberate learning investment (MISSION objective 2) rather than a disqualifier, since Godot's Python-like syntax keeps the ramp short.
  - Portability (step 4): open export pipeline, no engine lock-in beyond the project files themselves.
  - Platform fit (step 5): exports natively to Web, Android, Desktop, and Steam â€” matches `profiles/platforms.yaml` exactly.
  - Net cost (step 6): lower long-term cost than Unity (no license-tier risk) and broader than Phaser (2D + 3D + native builds vs. web-only).
- **Trade-off accepted:** giving up direct reuse of TypeScript/JS skill in the engine layer itself (Godot uses GDScript or C#) in exchange for one free engine that covers every target in `platforms.yaml` without a wrapper (e.g. Electron) or revenue cap.
- **Reversible?:** Yes, but costly â€” engine choice affects project structure from day one. Revisit only if a specific project's requirements (e.g. a pure browser-only 2D game) make Phaser clearly better for that one project; this doesn't have to be exclusive.
- **Note:** Phaser remains a valid secondary choice specifically for browser-only 2D games where reusing TypeScript directly outweighs Godot's platform breadth. Not logged as rejected outright â€” logged as "use Godot as the default, Phaser as the exception for web-only 2D."
- **Date:** 2026-07-24

---

### DECISION-002: App (daily-use mobile) stack

- **Options considered:** React Native (Expo), Flutter, native Kotlin/Swift
- **Chose:** React Native with Expo (SDK, current), TypeScript, RTK Query
- **Why:** Already proven at Intermediate skill level through real FlyCT work (Expo SDK 56 codebase); passes free-tier (Expo's core tooling is free), maintained, and reuses the same TypeScript/RTK Query skill already at Advanced from web work â€” highest score on step 3 and step 6 of any alternative.
- **Trade-off accepted:** none significant â€” this was already the working choice, logged here retroactively so it's referenceable by ID instead of re-justified per project.
- **Reversible?:** Yes, low cost â€” Expo apps stay close to standard RN, migration path exists if ever needed.
- **Date:** 2026-07-24 (retroactive)

---

### DECISION-001: Web stack

- **Options considered:** Next.js, plain React + Vite, Remix
- **Chose:** Next.js, TypeScript, Tailwind CSS
- **Why:** Advanced skill level already established through FlyCT work (Flyin EJSâ†’Next.js revamp). Passes free-tier (self-hostable, free hosting tiers exist e.g. Vercel/Netlify free plans), maintained, highest skill-match and lowest switching cost of any option.
- **Trade-off accepted:** none significant â€” retroactive log of an already-proven choice.
- **Reversible?:** Yes, low cost for new projects; not revisited for existing FlyCT work (out of scope for AI-OS, which governs personal projects).
- **Date:** 2026-07-24 (retroactive)

