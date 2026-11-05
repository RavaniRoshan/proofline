# LAW.md — Proofline build rules

Read this before touching any file. These are behavioural rules, not style preferences.
Project specifics live in `SPEC.md`. Data schemas live in `DATA.md`.

## 1. Think before coding

- State your assumptions and the tradeoff you chose in the PR description or commit body **before** writing code. If a requirement has two readings, list both and ask; do not pick one silently.
- If a feature can be done with a deterministic rule instead of a model call, say so and do that instead. Model calls are the most expensive and least reliable thing in this repo.
- Push back if a requested feature adds a service, a dependency, or a migration. Name the simpler version.

## 2. Simplicity first

- Write the minimum code that makes the current requirement work.
- No abstract base classes, factories, or plugin systems for single-use logic. No `utils/` grab-bag.
- No `try/catch` around internal states that cannot occur. Catch only at real boundaries: network, model output, user file input.
- No config file for something used once. Constants go at the top of the file that uses them.
- Self-check before finishing: **would a senior engineer call this overcomplicated? If it can be 50 lines instead of 200, rewrite it.**

## 3. Surgical changes

- Every changed line must trace to the task. No drive-by reformatting, no renaming unrelated variables, no "while I was here" cleanups.
- Match the existing file's naming, imports and typing style.
- Delete only the imports and variables **your own** edit orphaned.
- If you believe unrelated code is wrong, report it. Do not fix it in the same diff.

## 4. Goal-driven execution

Convert each task into a loop: `step -> verify: [command]`. Never report a task done without pasting the actual command output.

```
- install      -> verify: npm run build exits 0
- typecheck    -> verify: npx tsc --noEmit exits 0
- seed valid   -> verify: python3 scripts/validate_seed.py seed/ exits 0
- lint         -> verify: npm run lint exits 0
- unit tests   -> verify: npm test exits 0
- verdict rule -> verify: npm test -- verdict exits 0
- e2e flow     -> verify: npm run test:e2e exits 0
```

For any bug: write the failing test first, watch it fail, then fix. A fix without a failing test is a guess.

## 5. Product invariants that override convenience

These are correctness rules, not UI polish. Breaking one breaks the product's only claim.

- **Never emit `CONTRADICTED` without an evidence record.** Required fields: `fact_id`, `fact_version`, `source_document_id`, `source_span`, `valid_from`, `valid_until`. Enforce with a runtime assertion in code, not with a prompt instruction.
- **Never let the model author a citation.** The model returns `fact_id` values; the UI renders the source document, span and dates by looking those ids up. If an id does not resolve, the finding is downgraded to `UNVERIFIED`.
- **Deterministic before semantic.** Numbers, currency, dates, product names, approved terminology and required disclaimers are decided in TypeScript. The model is only called for claims those rules cannot decide.
- **No auto-publish.** Nothing in this repo writes to any external system.
- Oxblood is a brand mark, not a status colour. It appears on the logo brackets, primary buttons, section counters and inline links. Never on icons, active states, selection rings, or positive-action hovers.

## 6. Banned

- Adding an auth provider, a database server, a vector index, or a queue. The MVP is single-tenant and stateless by design (`SPEC.md` §3).
- `any` in TypeScript. Use `unknown` plus a Zod parse at the boundary.
- Committing a real API key, or logging one. Server-side env only.
- Editing `seed/` facts to make a test pass. The seed is the fixture; fix the code.
