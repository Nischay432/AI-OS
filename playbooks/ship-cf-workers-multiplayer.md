---
id: PLAY-CFSHIP-001
title: Ship a Cloudflare Workers multiplayer game
version: 0.6.0
status: Stable
owner: Nischay
depends_on: [REF-DECISIONS-001]
last_updated: 2026-08-02
---

# Playbook: Ship a Cloudflare Workers multiplayer game

Earned by shipping Maze Rush (2026-08-02) — the first real project through AI-OS. Steps assume the Workers + Durable Objects + native WebSockets + Vite client shape (see DECISION-005..008 for the choices behind it).

## Pre-ship hygiene checklist

1. `.gitignore` covers `.wrangler/`, `node_modules/`, `dist/` — and `git rm -r --cached` anything already committed (`.wrangler/cache/wrangler-account.json` holds the account ID).
2. `LICENSE` file + `license` field in every workspace `package.json`.
3. CI workflow: `npm ci` → typecheck every workspace → tests. Push once and watch it go green before deeper changes.
4. Generation/logic code that both server and client need lives in the shared workspace, imported as raw TS (`"main": "./src/index.ts"`) so drift is a compile error.

## Resilience baseline (players will drop)

- Join issues `{playerId, token}`; disconnect mid-game starts a grace timer (30s) instead of removing the player; `rejoin` first-message rebinds the socket and resyncs phase + remaining time from the server clock.
- Client keeps the session in `sessionStorage` (survives reload, not shared across tabs) and auto-rejoins with backoff.
- One durable `ctx.storage.setAlarm(...)` per round as a stuck-round safety net; full hibernation-API durability deferred per DECISION-007.

## Local multiplayer test protocol

- `npm run dev` (wrangler dev + vite, proxied `/ws` + `/api`); open 3+ tabs (one incognito), phone via `vite --host` on LAN.
- Must pass: mid-round joiner spectates; kill a tab mid-game → rejoin within grace resumes with correct timer; host quits → host migrates; reload mid-round → auto-resume.
- Maze/logic quality: seeded generation gets a deterministic test sweep (100 seeds × difficulty) instead of eyeballing; a `?debugSolve` overlay flag for manual feel-checks.

## Deploy

- `npm run deploy` (build client → `wrangler deploy`, assets + DOs one unit). Needs `wrangler login` (interactive) or `CLOUDFLARE_API_TOKEN` in CI/non-interactive shells.
- Windows note: wrangler needs Node ≥22; nvm-windows `use` silently fails without an elevated console — drop the official Node zip into `%APPDATA%\nvm\v<ver>` and PATH-prepend instead.

## Post-ship

- Smoke-test the live URL from two devices before announcing.
- Log every decision made during the ship in `reference/decisions-log.md` before the session ends (CLAUDE-001 rule 6).
