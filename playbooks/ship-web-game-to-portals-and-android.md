---
id: PLAY-PORTAL-001
title: Ship a web game to a game portal and Android
version: 0.8.1
status: Stable
owner: Nischay
depends_on: [REF-DECISIONS-001, PLAY-CFSHIP-001]
last_updated: 2026-10-19
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
- **External links from inside the Capacitor WebView are unreliable — render policy pages in-app.** Plain `target="_blank"` anchors are dead on device (the tap does nothing), and the `@capacitor/browser` (`Browser.open`) route also failed the device test. What held: the pages are bundled into the APK anyway (`public/`), so open them in an in-app iframe overlay with a Back button — no external hand-off, works offline, satisfies the store's in-app-policy requirement. Device-test every external link; the desktop web build cannot reveal any of this.
- **Backup rules should exclude `app_webview`.** Auto-backup restoring stale WebView internals onto a fresh install can corrupt the WebView; profile data in localStorage survives via the normal includes.

## 3b. Store release (Play)

Earned taking the same wrapper from debug APKs to a signed, Play-ready AAB (2026-08-22; DECISION-020):

- **CI builds the release, a secret holds the upload keystore.** Base64 the `.jks` into a repo secret, decode in the job, `bundleRelease` on `workflow_dispatch` only — per-push release builds waste minutes and expose the secret more often than needed. Enroll Play App Signing so Google owns the app signing key and the upload key stays replaceable.
- **Hard-fail unsigned release builds.** A Gradle config that silently falls back to unsigned turns a misnamed env var into a green build Play rejects later. Throw in `taskGraph.whenReady` if a release task runs without signing config.
- **Ship the boring first build.** Do not enable R8/minification on the same release that proves new signing + new packaging — write the Capacitor keep rules, commit them disabled, and make minification the next isolated experiment.
- **Verify the artifact, not the pipeline.** Download the AAB and `jarsigner -verify` / `keytool -printcert -jarfile` it; the cert SHA256 must match the upload key.
- **assetlinks needs three fingerprints** once Play App Signing is on: debug (dev builds), upload key (direct-installed release builds), and Google's app-signing key (store installs). Missing the last one silently kills deep links for every store user.
- **PowerShell pipes append CRLF to secrets.** `$val | gh secret set` and `$val | wrangler secret put` both store a trailing newline that `base64 -d` (or an equality check) rejects. Use `gh secret set --body` / bash `printf '%s'`, and verify a secret-dependent job end-to-end after setting it.
- **Play Console's ID-verification modal hides its Continue button below the fold.** "Upload complete — we're ready to continue" means *you* must scroll the modal and submit; an upload can sit unsubmitted for days looking like Google is slow. The `status: SUCCESS` in the network tab is the file upload, not the submission.
- **R8 as the isolated follow-up (Maze Rush 1.5, 2026-10-19):** `proguard-android-optimize.txt` + Capacitor's own consumer rules (plugins are kept via `extends Plugin`) took `classes.dex` from 7.3 MB to 0.94 MB with no crash. Pin `@xml/config` in a `res/raw/keep.xml` — Cordova's parser finds it by name. AGP bundles the mapping file into the AAB (`BUNDLE-METADATA/…/proguard.map`), so Play deobfuscates without a manual upload; keep a copy as a CI artifact for `retrace`.
- **Check what `public/` drags into the app.** A web press kit (trailers, covers) was 84% of the shrunk AAB. Drop web-only folders from the app build output.
- **Gate release builds on a CI emulator, driven over CDP.** With no local SDK, a `workflow_dispatch` job runs the release-type APK (debug-key signed, so no secrets) on `reactivecircus/android-emulator-runner` and drives the WebView through its DevTools socket: plugin headers, App Links warm/cold, back button, share sheet, ads. Turn on `webContentsDebuggingEnabled` and compile analytics off for that build only. Traps it hit: the AVD's default 7 GB data partition doesn't fit the runner (free toolchains, `disk-size: 4096M`); a fresh emulator restarts Play services and **kills apps bound to them** (the WebView uses their font provider) while first-boot theme overlays relaunch the activity — do a throwaway launch, wait until `gms.persistent` holds one pid, then `pm clear` — and still retry the run when logcat says the app was killed for depending on a dying Play services provider (it can land mid-run); demo video ads ignore back, so close ads by tapping the ✕ found via `uiautomator dump`; `logcat -d` overflows Node's 1 MB exec buffer and the ring buffer drops the crash — stream logcat to a file from the start.
- **AdMob through `@capacitor-community/admob`:** it ships no ProGuard rules but survives R8 on Capacitor's plugin keep rule — prove it with an E2E run, not an assumption. `showRewardVideoAd()` never settles if the player closes early: resolve from the `Dismissed`/`Rewarded` events. Test the server kill switch by serving the config over CDP `Fetch` interception, so the test doesn't depend on production.
- **Self-hosted error beacons need an offline retry queue.** The crashes most worth seeing (startup, offline) are exactly the ones a fire-and-forget beacon loses; park failed batches in localStorage and flush on next launch. Native crashes stay invisible without a crash SDK — Play vitals only covers opted-in devices, accepted for a small closed test.

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

