# App Starter — Expo (React Native) + TypeScript + RTK Query

Backed by DECISION-002. Use this as the first commit of any new daily-use mobile app.

## Stack
- Expo (managed workflow, current SDK), TypeScript
- Redux Toolkit + RTK Query for any project that talks to a real API or needs shared cached state
- React Navigation for multi-screen apps

## Setup

```bash
npx create-expo-app@latest my-app -t
cd my-app
npx expo install @reduxjs/toolkit react-redux
```

Copy `src/store/` from this template as the starting Redux setup.

## Conventions
- `src/screens/` — one file per screen, no business logic beyond UI composition
- `src/store/` — RTK slices + RTK Query API definitions, one slice/api per domain
- `src/components/` — shared UI only
- No `Node.js` backend assumptions baked in — if the app needs a backend, that's a separate decision logged in `reference/decisions-log.md`, not bundled here

## New Architecture note
Before adding any native module, check it against New Architecture compatibility first — this bit you already once at FlyCT (see `profiles/learning.yaml`). Don't relearn that lesson on a personal project.

## When this template graduates to a playbook
First time an app from this template actually reaches the Play Store, write `playbooks/ship-android-expo.md` with the real steps (EAS build config, signing, store listing) — not before.
