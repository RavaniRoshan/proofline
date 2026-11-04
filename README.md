# Proofline — Round 2 build harness

CodeNexus India 2026 · Round 2 · **closes 2026-11-07, 10:00 AM IST**
Team SHIVAMKUMAR10958 · Roshan Ravani Singh (leader) · Nitansh Rabari

This folder is the engineering harness, not the app. It exists so a coding agent builds the
scored workflow instead of boilerplate.

```
LAW.md                 behavioural rules for the agent (72 lines)
SPEC.md                what to build, the verdict rules, and the scope cut
DATA.md                the seed data contract, for any agent that opens this repo
seed/                  a runnable fact register, a sample draft, 24 labelled cases
scripts/validate_seed.py   standard-library validator, exits non-zero on bad data
```

## Verify the substrate before writing any code

```
python3 scripts/validate_seed.py seed/
```

Current state: **PASS** — 41 fact rows across 40 fact ids, 4 source documents, 24 smoke cases
covering all six verdicts (5 supported, 6 contradicted, 3 stale, 3 conflicting, 3 unverified,
4 not checkable).

## The one sentence that decides Round 2

A judge opens the URL, pastes a draft, clicks Check, sees findings with sources, and makes a
decision — **without signing in and without reading anything first**. Everything in the spec
serves that sentence.

---

## Mapping to the seven required submission items

The organiser requires seven things. Here is where each one comes from.

| Required item | Where it comes from |
|---|---|
| **Working project link** | Vercel production URL. Must open in incognito with no sign-in. Verify before submitting. |
| **Source-code repository link** | GitHub repo containing this harness plus the app. Public. |
| **Updated project PDF** | Regenerate from the Round 1 source with the Round 2 changes from `SPEC.md` §6 folded in. |
| **List of completed features** | Build it from `SPEC.md` §5 "Ships", and only claim what the five verification commands prove. |
| **Technology and implementation details** | `SPEC.md` §2 (four stages) and §3 (views and state). |
| **Explanation of changes to the original plan** | `SPEC.md` §6 — the table of five changes with reasons. Written to be pasted almost verbatim. |
| **Three major improvements for Round 3** | `SPEC.md` §7. Unchanged from Round 1, and they are product additions, not design changes — which is what the brief demands. |

---

## Build order, if you have 2.5 days

Do these in order and stop wherever the clock stops. Each step leaves something a judge can use.

**Day 1 — the spine.** Next.js app on Vercel. `seed/*.json` loaded at build. Stage 1 deterministic
classifier in TypeScript with unit tests. `/api/verify` with Zod parsing and the evidence gate.
The `/` draft-checker view wired end to end with a hardcoded model stub first, then the real call.

**Day 2 — the human half.** Findings list with evidence and suggested correction. Reviewer decision
with a required reason. Append-only audit log in `localStorage`. "Reset demo" button. Run the
Stage 2 smoke gate; do not proceed until ≥20 of 24 pass.

**Day 3 — the rest, then the submission.** `/facts` register view with stale and conflicting filters.
`/dashboard` counts. `/about` with the PDF link. Then: incognito test, repo link test, regenerate the
PDF, write the seven submission items, submit.

## If you run out of time, cut in this order

1. `/dashboard` — counts are nice, not scored.
2. `/facts` filtering — the register list matters more than the chips.
3. The suggested-correction field — a finding with a source and no rewrite still demonstrates the product.
4. Candidate-fact approval — this is the strongest thing to lose last, because it is the "human approves
   the facts" half of the thesis. If it goes, say so plainly in the submission.

Never cut: the evidence gate, the six verdicts, the reviewer decision, the audit entry. Those four
*are* the product the brief asked for.

## Two failure modes that already cost teams their place

- **A link that asks for sign-in.** Test every URL in a private window, including the repo.
- **An empty dashboard as the landing page.** The brief is explicit that a login screen, settings page
  or empty dashboard alone does not count. `/` must be the working checker, pre-populated.
