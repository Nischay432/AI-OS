---
id: REF-TOOLS-001
title: Tool Evaluations
version: 0.9.1
status: Living document
owner: Nischay
depends_on: [FRAMEWORK-001]
last_updated: 2026-11-16
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

## EVAL-009: ECC agent-harness bundle (`affaan-m/ecc`) — ⚠️ Cherry-picked one idea; wholesale install rejected

- **Context:** evaluated as a source of reusable Claude Code artifacts — 285 skills, 68 agents, 94 legacy command shims, a hook set, and an MCP config bundle, MIT-licensed, cross-harness (Claude Code, Codex, Cursor, Gemini, Zed).
- **Adopted:** nothing as-shipped. One idea was adapted — the structured review-packet from its `council-multi-model` skill (untrusted-content framing, four fixed critique questions, verbatim quoting, honest "review absent" labelling) became a local `critique-packet` skill at user scope, with zero dependencies. It encodes the workflow DECISION-019 already describes.
- **Rejected — wholesale install (step 6):** 285 skills plus 68 agents is a large standing context cost, and the hook set registers Node scripts on `PreToolUse *`, `PostToolUse *`, `Stop` and `SessionStart` — code on every tool call. That is the exact inverse of PRINCIPLE-006, and two of its hooks actively block edits. The installer's real behaviour lives in an unaudited Node script, so `install.sh` was not run.
- **Rejected — `council-multi-model` as shipped (step 1):** requires the Codex CLI plus OpenAI credentials. Paid dependency for something already done free by pasting into two chat UIs. Fails free-first outright.
- **Rejected — redundant with what already exists:** its session/handoff and compaction skills duplicate the checkpoint skill and size-band hook built under DECISION-018; its code-review and security-review skills duplicate ones Claude Code already ships; its `context-budget` audit duplicates `/context`. Same reasoning as EVAL-008 rejecting web-search MCPs.
- **Caveat on popularity:** the repo reports an implausible star count for its age and profile. Treat the social proof as unverified and judge files on their contents — which is why only files actually read were reused.
- **Standing rule:** harness bundles get mined for *patterns*, never installed wholesale. A skill earns a place the same way a playbook does — after the manual version has been done at least twice.
- **Date:** 2026-08-18. Revisit only if a specific repeated task has no local answer.

## EVAL-010: Claude Code plugins, skills and MCP servers from a social-media shortlist — ✅ Nine installed on a trial basis; the rest rejected

- **Context:** about 45 tools suggested across ten Instagram reels, triaged against what the projects under `Downloads/Repos` actually need (Maze Rush, the Suki Shorts channel, SWAPPED v2, portfolio, On Record). Installed 2026-11-13 at Nischay's instruction.
- **Departs from the EVAL-009 standing rule.** None of these was earned by doing the manual version twice first. Treat every row below as a trial: anything unused by the review date gets removed.
- **Installed:**

  | Tool | Kind | Scope | What it is for |
  |---|---|---|---|
  | `claude-code-setup@claude-plugins-official` | plugin (Anthropic) | user | Scans a repo and recommends hooks, skills, subagents and MCP servers for it |
  | `taste-skill@taste-skill` (Leonxlnx) | plugin | user | Design direction for web UI, with a real-browser finish check |
  | `web-design-guidelines` (vercel-labs/agent-skills) | skill | user (`~/.claude/skills/`) | Audits UI code against Vercel's Web Interface Guidelines; fetches the rules at run time |
  | `pixelfx@pixelfx` (patch-gg) | plugin | user | Pixel-art effects as code, exported as sprite sheets |
  | `ponytail@ponytail` (DietrichGebert) | plugin | user | Pushes toward the shortest working solution |
  | `youtube-agent@youtube-agent-skill` (Jakeschincariol) | plugin | user, and project in `youtube-channel/` | Eleven `/yt-*` skills: hooks, titles, retention, planning, SEO |
  | `blender-skills@blender-skills` (arjun988) | plugin | project, `games/swapped2/` only | 95 Blender skills driven through the Blender MCP server |
  | Godot MCP (`@coding-solo/godot-mcp`) | MCP server | project, `games/swapped2/.mcp.json` | Launch the editor, run the project, read debug output |
  | Blender MCP (`mcp-for-blender`) | MCP server | project, `games/swapped2/.mcp.json` | Configured with telemetry off; the Blender addon is not installed yet |
  | SkillSpector 2.12.0 (NVIDIA) | CLI, `uv tool` | machine | Scans a skill pack before install |

- **Step 1 (free-first):** pass for all — MIT or Apache-2.0, no key, no card. New machine dependencies: `uv` (winget) and a uv-managed Python 3.12.
- **Step 6 (context cost, PRINCIPLE-006):** the 95-skill Blender pack is scoped to `games/swapped2/` so its descriptions never load elsewhere. Ponytail is the only one that adds hooks (`SessionStart`, `SubagentStart`, `UserPromptSubmit`) and it writes a per-task ledger to `~/.config/ponytail/band/`; its webhook is empty, so nothing leaves the machine.
- **Pre-install scan (SkillSpector, static checks only):** YouTube, Ponytail, web-design-guidelines and Blender packs scored 0/100. pixelfx scored 29: its SKILL.md section 5 offers to install the Patch CLI by remote script and publish the game on patch.gg — decline that step. taste-skill scored 100 on "hidden instructions"; the flagged lines were read and are ordinary HTML comments in its templates (false positive).
- **Open item — Blender addon:** using Blender MCP means agreeing to its terms of use, and it sends an anonymous usage record unless telemetry is disabled. That agreement is Nischay's to make, so the addon was left uninstalled. To finish: `uvx mcp-for-blender install-addon`, enable it in Blender, then press Connect in the sidebar.
- **Rejected:**
  - OmniRoute, FreeLLMAPI — swap in weaker free models mid-session and route code through many third-party providers.
  - claude-mem, Headroom, Task Observer — duplicate auto memory, the Memory MCP, handoffs and the checkpoint hook (DECISION-018).
  - Agent Reach — the signed-in Chrome already reaches those sites; cookie scraping risks the channel's accounts.
  - Strix — needs Docker and a paid model key; `/security-review` covers it.
  - ECC, Claude Code Game Studios — wholesale harness bundles (see EVAL-009).
  - Playwright CLI — the built-in browser preview already inspects and tests UI.
  - Unreal Claude, Audio2Face-3D, ACE-Step — wrong engine, 3D-only lip sync, music already generated in code.
  - OpenHiggsField, Voice Studio, OpenSEO, AppFlowy, OpenWhisper, OpenProject, Cal.com, Chatwoot, Cap — standalone apps, not Claude Code extensions.
- **Remove with:** `claude plugin uninstall <name>@<marketplace>`; delete `~/.claude/skills/web-design-guidelines/`; delete the server from `games/swapped2/.mcp.json`; `uv tool uninstall skillspector`.
- **Date:** 2026-11-13. Review on 2026-12-13: keep what was actually invoked, uninstall the rest.

## EVAL-011: brag (`latent-spaces/brag`) — ✅ Adopted after one real use; OpenJarvis, OmniRoute and a game-dev skills pack assessed

- **Context:** a second batch of reel suggestions, 2026-11-16. Unlike EVAL-010, brag was used on a real project the same day it was installed.
- **Adopted — `brag@brag` (plugin, user scope, MIT):** turns a project into a ~20 s launch video with soundtrack and share copy. On current models `/brag` hands off to `/brag-slim`, which is a creative brief, not a renderer: Claude builds the video with whatever is on the machine.
- **First use — Maze Rush:** output in `fullstack/maze-rush/marketing/brag-output/` (`brag.mp4` vertical 1080×1920, `brag-landscape.mp4` 1920×1080 for the Play listing, `share-copy.txt`, `brag-plan.md`). The maze is the game's own `generateMaze` / `solvePath`; colours and fonts are the game's tokens.
- **How it was rendered here (reusable):** no new installs. `work/node_modules` is a junction to `youtube-channel/studio/node_modules`, so the Remotion already installed for the channel bundles a composition living in the game repo, which imports the game's TypeScript source by relative path. The soundtrack is synthesised by a small Node script on the same beat grid as the cuts. Remotion fetched a ~120 MB headless Chrome on first render.
- **Pre-install scan:** SkillSpector scored 100 on two patterns; both lines were read and are harmless — a README install path, and the instruction "prefer a package manager over `curl | sh`" itself matching the remote-script rule.
- **Step 1 (free-first):** pass. The hosted letsbrag.app alternative was not used.
- **Not adopted:**
  - OpenJarvis (Stanford, Apache-2.0) — a local assistant on an Ollama model. It would compete with ComfyUI for an 8 GB GPU, and the Gmail connector, scheduled tasks and the morning brief already do its job. Revisit only for offline use.
  - OmniRoute, second look — it does expose image and speech endpoints and a ChatGPT-subscription login, but that login runs a consumer account through a third-party gateway (account risk; Anthropic's terms forbid it outright for Claude logins). Pollinations and ComfyUI already cover images; a free Gemini API key called directly covers automated second opinions.
  - awesome-gamedev-agent-skills — only its Godot bundle (~15 skills) fits, and only SWAPPED v2. Deferred until that project is active; then install router + Godot bundle at project scope in `games/swapped2/`.
- **Date:** 2026-11-16. brag is reviewed with the EVAL-010 set on 2026-12-13.

---

## Standing rule from this evaluation pass

None of the AI video-gen tools evaluated clear the free-first bar for production use — every free tier is watermarked and/or capped for testing only. **Don't subscribe to any of them speculatively.** The moment a real project needs a finished video asset (app demo reel, game trailer), re-run steps 1 and 6 of `DECISION_FRAMEWORK.md` against current pricing for that specific, one-off need — pay per-clip via whichever aggregator is cheapest that month rather than holding a standing subscription.

Kling/Runway/Higgsfield/Luma/Seedance's own subscriptions and their reasoning have real churn risk: pricing on all five changed multiple times through 2026 per the sources checked. Treat every number in this file as stale after ~2 months; re-verify before acting on it.
