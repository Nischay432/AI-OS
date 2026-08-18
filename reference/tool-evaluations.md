---
id: REF-TOOLS-001
title: Tool Evaluations
version: 0.5.0
status: Living document
owner: Nischay
depends_on: [FRAMEWORK-001]
last_updated: 2026-08-03
---

# Tool Evaluations

Append-only log of tools run through `DECISION_FRAMEWORK.md`. Distinct from `decisions-log.md`, which is for things actually adopted — this file also records rejections, since the reasoning has future value. Prices/limits verified via web search on 2026-07-24; these tools change pricing often, re-verify before relying on a figure here.

Covers: NotebookLM, Kling AI, Higgsfield AI, Runway ML, Seedance, Google Flow, Luma Dream Machine — the tools listed when this repo started, evaluated for fit against PRINCIPLE-003 (free-first) and the platform/asset needs of app + game projects (not just video-creator content).

---

## EVAL-001: NotebookLM — ✅ Adopted (research/planning use)

- **Free tier:** genuinely usable — 100 notebooks, 50 sources/notebook, ~50 chats/day, audio+video overviews included. Runs on Gemini 3.
- **Step 1 (free-tier viable):** pass — no credit card, not a time-boxed trial.
- **Step 2 (maintained):** pass — actively developed, folded into Google AI plans May 2026.
- **Step 3 (skill match):** N/A, it's a research tool not a dev skill.
- **Fit for AI-OS:** use for dumping project research, competitor app analysis, or long docs (API references, engine manuals) into a queryable notebook before starting a project. Not part of the build pipeline itself.
- **Verdict:** keep on free tier indefinitely; no reason to pay unless source/chat caps are actually hit.

## EVAL-002: Google Flow — ⚠️ Conditional

- **Free tier:** exists (Nano Banana + Veo 3.1 access with monthly credit limits, no card required) but outputs carry a visible + invisible watermark on free/Plus; only Ultra ($100+/mo) removes the visible one.
- **Step 1:** partial pass — free tier is real but watermarked, so it's evaluation-only, not production-usable for anything shipped.
- **Step 2:** pass — actively developed (unified Whisk+ImageFX+Flow, Feb 2026).
- **Fit for AI-OS:** fine for testing prompts / storyboarding a game trailer or app marketing clip concept. Not for final assets while on free tier.
- **Verdict:** free tier for prototyping only. Don't pay for this specifically — if a project needs clean video assets, re-run this decision against whatever's cheapest at that time (Kling via Higgsfield was cheapest per-clip as of this evaluation).

## EVAL-003: Kling AI — ⚠️ Conditional (best accessed via Higgsfield, not directly)

- **Free tier:** Kling itself is credit/trial-based, not a sustainable free tier for ongoing use.
- **Step 6 (cost):** as of this evaluation, Kling 3.0 clips were priced lower through Higgsfield (~$1.00/clip) than direct/Runway (~$1.30/clip).
- **Fit for AI-OS:** don't subscribe to Kling directly. If Kling's motion quality is specifically needed for a project asset, access it through whichever aggregator (Higgsfield, or a cheaper aggregator found at time of use) has the best per-clip rate — re-check this, pricing moves monthly.
- **Verdict:** not adopted as a standalone subscription. Logged as "access via aggregator, decide per-project."

## EVAL-004: Higgsfield AI — ❌ Not adopted as a subscription

- **Free tier:** exists but thin — ~2 videos/month at 5s, 720p, watermarked.
- **Step 1:** fails for real use — free tier is testing-only, and paid tiers ($15–$129/mo) are credit-metered with credits that don't roll over (use-it-or-lose-it risk flagged in PRINCIPLE-003 terms).
- **Fit for AI-OS:** useful as a per-clip aggregator (see Kling entry above) if a specific asset is ever needed, not as a standing subscription — there's no steady monthly content-production need in this system yet to justify $15+/mo.
- **Verdict:** rejected as a subscription. Revisit only if a project has a recurring, real need for cinematic video assets (e.g. a marketing pipeline for a shipped product).

## EVAL-005: Runway ML — ❌ Not adopted

- **Step 1:** fails — no meaningful free tier; paid starts at $15/mo (Basic) up to $95/mo (Pro).
- **Step 6:** more expensive per-clip on shared models (Kling, Seedance) than Higgsfield; only wins if using Runway's proprietary Gen-4.5 model specifically, which isn't a current need.
- **Verdict:** rejected for now. Its stronger editing environment is a real differentiator, but not justified without a concrete recurring editing need.

## EVAL-006: Luma Dream Machine — ⚠️ Conditional (free tier only)

- **Free tier:** real — ~30 generations/month, watermarked, no commercial rights. Fine for testing, not for shipped assets.
- **Step 1:** partial pass, same pattern as Google Flow — free tier is genuinely free but not commercially usable.
- **Fit for AI-OS:** prompt-testing and style exploration only.
- **Verdict:** free tier kept as an option for early concepting; no paid tier justified currently.

## EVAL-007: Seedance 2.0 — ⚠️ Access via cheapest aggregator, not a standing pick

- **Landscape:** priced anywhere from free (via Dreamina/Doubao/Little Skylark trial credits) to ~$167/mo depending on platform; Dreamina's ~$9.60/mo tier was the best-value paid entry point as of this evaluation.
- **Step 6:** same pattern as Kling — cost varies heavily by which aggregator is used, so this isn't a "subscribe once" decision.
- **Verdict:** not adopted as a subscription. If a project needs a Seedance-quality clip, re-check current cheapest access point at that time rather than defaulting to a locked-in platform.

## EVAL-008: MCP servers — ✅ Adopted (Context7 + Memory, user scope); web-search/token MCPs rejected as redundant

- **Context:** first actual MCP adoption, ending the v0.3.0 deferral. Evaluated against Claude Code's built-ins rather than in a vacuum.
- **Adopted:** `@upstash/context7-mcp` (live version-accurate library docs — React/Next/Expo/Godot; free, no key) and `@modelcontextprotocol/server-memory` (cross-chat knowledge-graph notes, local file at `~/.claude/mcp-memory.json`; free). Both npx stdio servers configured at user scope in `~/.claude.json`, so they load in every chat, not just this repo.
- **Rejected:** web-search MCPs (Claude Code has built-in WebSearch/WebFetch + browser — pure redundancy) and any "token optimization" MCP (doesn't exist as a category; token discipline is PRINCIPLE-006 practice, and every added MCP *costs* context).
- **Step 1 (free-first):** pass for both — no card, no key, local execution.
- **Date:** 2026-08-03. Re-verify package health if either misbehaves; both are drop-one-line-from-config reversible.

---

## Standing rule from this evaluation pass

None of the AI video-gen tools evaluated clear the free-first bar for production use — every free tier is watermarked and/or capped for testing only. **Don't subscribe to any of them speculatively.** The moment a real project needs a finished video asset (app demo reel, game trailer), re-run steps 1 and 6 of `DECISION_FRAMEWORK.md` against current pricing for that specific, one-off need — pay per-clip via whichever aggregator is cheapest that month rather than holding a standing subscription.

Kling/Runway/Higgsfield/Luma/Seedance's own subscriptions and their reasoning have real churn risk: pricing on all five changed multiple times through 2026 per the sources checked. Treat every number in this file as stale after ~2 months; re-verify before acting on it.
