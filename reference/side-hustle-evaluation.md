---
id: REF-HUSTLE-001
title: Side-Hustle Evaluation
version: 0.10.0
status: Living document
owner: Nischay
depends_on: [FRAMEWORK-001]
last_updated: 2026-11-16
---

# Side-Hustle Evaluation

A dated evaluation of six AI-assisted side businesses for one solo developer with a full-time job: about 12 hours a week, near-zero budget, based in India. Built on 2026-11-16 from nine specialist research reports, three hostile reviews (investor, risk auditor, devil's advocate) and two outside-model critiques. These are **verdicts with reopen conditions, not decisions**: per CLAUDE-001 rule 6, nothing here is settled until it is logged in `reference/decisions-log.md`. Not legal, tax or investment advice.

Labels: **[FACT]** read at a primary source, **[SECONDARY]**, **[ANECDOTE]**, **[ESTIMATE]**, **[JUDGMENT]**.

## Bottom line

1. None of the six has a base case above about $100 a month after 12 months at 12 hours a week; most cluster at $0 to $1 per hour worked. [ESTIMATE]
2. Every revenue-gating step found is human: a sales conversation, a design call, a portal submission. Automation and agent setups are not what stands between a solo developer and the first income.
3. The cheapest real evidence comes from testing an asset you already own (a shipped game, an audience, a skill people pay for) before building anything new.

## Verdicts

| Idea | Verdict | Why | What would reopen it |
|---|---|---|---|
| A. Clipping on pay-per-view marketplaces | Reject | Median about $1.09 per 1,000 views across 707 live campaigns [FACT, 10 Nov 2026]; payouts can be reversed; payout to India undocumented | Documented India payouts and first-hand hourly earnings above contract-work rates |
| A. Permissioned clipping service | Postpone | Outbound sales; beaten on income per hour by frontend contract work | A warm client already in your network |
| B. AI UGC ad agency | Reject (moderate confidence) | Generation is a commodity (free avatar video inside ad platforms), needs outbound sales and a standing subscription, no outcomes evidence either way | Three paying brands with repeat orders |
| C. Pipeline of small games | Postpone | Specialist's own odds of meaningful income in three years under 30%; portal earnings evidence is the thinnest in the set | One gated test on an existing game clears its gate |
| C. One portal test of an existing game | **Do** (20 to 30 hours, no cash) | Turns a sunk asset into real data: plays, revenue per 1,000 plays, whether a portal promotes it | — |
| D. Faceless, templated AI Shorts for ad revenue | Reject | About 20 times below the revenue floor at documented solo scale; YouTube excludes mass-produced, templated content from monetisation | An original-format channel past 1 million views a month |
| D. AI-*assisted* original Shorts | Not rejected | Policy allows AI-assisted original work; judge it on its own channel data, not on the faceless benchmark | — |
| E. Instagram + YouTube distribution as a business | Reject as standalone; use as a layer | No direct income path in India within 12 months | A product with measured value per user to send viewers to |
| F. Live AI trading | Reject | 87.7% of individual equity-derivatives traders lost money in FY2025-26 [FACT, SEBI]; no LLM system with credible after-cost, out-of-sample results; Anthropic's consumer terms prohibit relying on the service to buy or sell securities [FACT] | None foreseeable for an LLM-driven system |
| F. Paper-trading project | Postpone | 200 to 400 hours with no revenue path | A first income stream exists; then only as a learning project |
| Instagram "comment a keyword for the link" creator business | Reject as standalone | Creators mostly earn by selling courses and communities; claims checked were often wrong | Use the mechanic only to point at your own product |

## Options outside the six (unresearched, test before committing)

| Option | Why it ranks well | What to check first |
|---|---|---|
| Demand test of a developer SaaS | Dollars per customer instead of fractions of a cent per view | Whether 3 of 15 to 20 engineers pre-pay; the field is crowded, including free tools |
| Productised or contract frontend work | Best income per hour examined ($6 to $23 base estimate); zero cash | Employment terms; it cannot be automated and takes the whole time budget |
| TypeScript micro-tools on marketplaces | Low build cost | Discovery, payment platforms that pay out to India, realistic earnings |

## How to evaluate the next idea

1. **Employment terms first.** Read the outside-work and IP-assignment clauses before any paid side work. One hour, and it can remove most options.
2. **Income per hour, all hours counted.** Put every option on the same basis, unpaid hours included, with a base and an optimistic case. Write "no basis" where evidence cannot support a number.
3. **One build bet at a time,** plus at most an hour a week of distribution attached to it.
4. **A gate and a stop-loss before starting.** A date, a metric and a stop rule, e.g. "3 pre-payments after 20 conversations, else shelve" or "under $200 cash by 300 hours, else hobby".
5. **Automate only what was done by hand three times.**
6. **Your own data beats more web research.** Retention, revenue per 1,000 plays, conversion: these move a ranking more than another report.
7. **Red flags:** success stories that sell a course; "free tool, comment for the link" (a known malware bait pattern); "unlimited usage" or "fewer tokens" claims; anything that posts or engages through browser bots (breaches platform terms).

## Platform facts worth remembering (as of 2026-11-16)

- **YouTube:** mass-produced, templated content cannot be monetised; AI-assisted original work can. From 1 Feb 2027 new applicants need 20M Shorts views in 90 days, and 10M qualified views in 90 days becomes the floor for Shorts pool money. [FACT] Revenue per 1,000 Shorts views for an India-heavy audience: about $0.008 to $0.35, conflicting sources. [SECONDARY]
- **Instagram:** original-content rules extended from Reels to photos and carousels on 30 Apr 2026; a border, watermark, subtitles or credit alone is not originality; undisclosed AI-person profiles get limited reach (31 Aug 2026). [FACT] India availability of Instagram's own payout programmes is unverified.
- **One Google identity** behind Play, AdMob, AdSense and YouTube means enforcement on one can spread to the others; Google Play bars multiple apps with highly similar functionality. [FACT]
- **Web game portals** mostly do not publish revenue shares (itch.io defaults to 10%; Playgama publishes 70/80/90%). Earnings evidence is anecdotal: about EUR 1.2 per 1,000 plays in one report. [FACT / ANECDOTE]
- **India retail algo trading** requires a static IP for orders and a daily manual two-factor login, so unattended running is not possible. [SECONDARY]

## What not to spend money on before a first income

AI video, avatar or clipping subscriptions; paid courses on any of these ideas; paid user acquisition for a game; trading capital or market-data fees; a second domain or paid hosting.
