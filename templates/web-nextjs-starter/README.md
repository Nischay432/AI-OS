# Web Starter — Next.js + TypeScript + Tailwind

Backed by DECISION-001. Use this as the first commit of any new personal web project.

## Stack
- Next.js (App Router), TypeScript, Tailwind CSS
- ESLint + Prettier preconfigured
- No state library included by default — add RTK Query only if the project needs shared server-state caching (per DECISION-002's reasoning); plain `useState`/`fetch` is enough for most small tools.

## Setup

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd my-app
```

Then copy `src/app/layout.tsx` and `tailwind.config.ts` from this template over the generated ones if you want the starting conventions below.

## Conventions
- `src/app/` — routes only. No business logic in page files.
- `src/components/` — shared UI, one component per file, co-located styles via Tailwind classes (no separate CSS files unless truly global).
- `src/lib/` — pure functions, API clients, utilities.
- Absolute imports via `@/*`, never relative `../../../`.

## Deploy
Free tier: Vercel (zero-config for Next.js) or Netlify. No paid tier needed until traffic/usage justifies it (PRINCIPLE-003).

## When this template graduates to a playbook
The first time a project built from this template actually ships (deployed, real URL), write `playbooks/ship-web-nextjs.md` documenting the exact steps taken — env vars, domain setup, any gotchas. Don't write that playbook speculatively.
