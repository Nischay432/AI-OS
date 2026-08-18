---
id: PLAY-PORTAL-001
title: Ship a web game to a game portal and Android
version: 0.7.0
status: Stable
owner: Nischay
depends_on: [REF-DECISIONS-001, PLAY-CFSHIP-001]
last_updated: 2026-08-18
---

# Playbook: Ship a web game to a game portal and Android

Earned taking Maze Rush from "deployed on its own domain" to portal-submitted and Android-packaged (2026-08-15 → 2026-08-19). Assumes the shape PLAY-CFSHIP-001 leaves behind: a working web build on Cloudflare Workers. Choices behind these steps are DECISION-014 (platform adapters), DECISION-016 (Capacitor), DECISION-017 (analytics).

Order matters: **portal first, store second, own-site ads last.** Portals bring traffic, stores need retention evidence to be worth the account cost, and ad revenue on your own domain is a function of traffic you do not have yet.

## 1. Build the platform seam before the second target

One module resolved at build time owns every environment difference: API origin, socket origin, canonical share origin, external-link gating, portal SDK glue. Screens never branch on platform.

- **`window.location.origin` is a lie on every non-web target** — it reports `https://localhost` inside a Capacitor shell and the CDN origin on a portal. Route every shareable or invite link through one canonical origin constant from day one, not after the first broken link.
- Portal SDK calls should no-op silently when not on the portal, so the web build carries no conditionals.
- Keep cosmetic state derived, never transmitted. Theme, palette, decor — make them pure functions of the same seed both sides already share, and the wire protocol never changes.

## 2. Portal submission

- **Read the uploader's shape before building.** One portal's uploader is a flat directory picker: nested asset folders are lost, so the build must emit a flat asset dir with root-level icons. Make that the permanent build output rather than a post-processing step you will forget.
- Meet the *behavioural* acceptance requirements, not just the technical ones — if the portal renders an invite button, your room-full state has to make it honest, and a portal-supplied username should prefill the profile.
- Serve your API with permissive CORS on read paths (and an OPTIONS preflight) since the game is now served from their CDN origin, not yours.
- Size limits are generous; the real constraints are structure and behaviour.
- **A rejected submission can lock art uploads.** Host the press kit yourself at a stable path and link it from the appeal, so the assets are reviewable even while the submission is frozen.

## 3. Android wrapper

A WebView wrapper is a third build target, not a rewrite — but it is its own platform with its own bugs:

- **Safe-area insets:** CSS `env(safe-area-inset-*)` and the wrapper's injected CSS variables both proved unreliable on device. Fix it natively — margin the WebView inside system-bar + display-cutout insets, consume them, and paint the bar areas with the app background.
- **Hardware back needs explicit routing** (in-room → leave, sub-screen → home, home → minimize) or it closes the app from anywhere.
- **CI-built APKs need a checked-in debug keystore** and a signing config. Without a stable signature every build refuses to install over the last one.
- **Backgrounding the app suspends the WebView and drops the socket.** Sending an invite means backgrounding — so instant lobby removal frees the room code before the invitee ever arrives. Needs a reconnect grace window *and* a warm claim on emptied room codes.
- Deep links need `autoVerify` App Links plus the asset-links file served from your domain; remember the release key's fingerprint is a separate entry from the debug one.

## 4. Instrument before you need the answer

Count the smallest set that answers your actual question (see DECISION-017). For a game the load-bearing one is first-session → second-session conversion, which is a session-ordinal counter, not a funnel product.

Whitelist every dimension value server-side. An open dimension turns aggregate counters into a spam target.

Ship an operator kill switch — a secret-gated endpoint to hide or reset a live board — *before* launch, not after the first bad day.

## 5. Mobile-web traps that do not show on desktop

- `min-height: 100vh` includes collapsed browser chrome and silently overrides `height: 100dvh`, pushing a locked-camera canvas below the fold. Invisible on desktop, game-breaking with `touch-action: none`.
- Auto-repeat on its own timer double-fires on quick taps: a sub-80ms tap can catch a stray tick and move twice. Move instantly on press, and gate repeat behind a continuous hold (~200ms), reset on direction change.

## 6. Post-ship

- Smoke-test the portal build and the APK on a real device before announcing — the emulator will not reproduce the inset or backgrounding bugs.
- Log every decision made during the ship before the session ends (CLAUDE-001 rule 6), and checkpoint the session rather than continuing it into the next workstream (DECISION-018).
