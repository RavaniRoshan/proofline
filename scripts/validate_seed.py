#!/usr/bin/env python3
"""Validate the Proofline seed substrate. Standard library only.

    python3 scripts/validate_seed.py seed/

Checks referential integrity, required evidence fields, date sanity and smoke-case
labels. Exits non-zero on the first class of failure it finds, printing the bad row.
"""

import json
import os
import sys
from collections import Counter, defaultdict

REQUIRED_FACT = [
    "fact_id", "version", "product_id", "attribute", "value", "unit",
    "source_document_id", "source_version_id", "source_span",
    "valid_from", "valid_until", "status", "approved_by", "approved_at",
]
VERDICTS = {"SUPPORTED", "CONTRADICTED", "STALE", "UNVERIFIED", "CONFLICTING", "NOT_CHECKABLE"}
STATUSES = {"approved", "superseded", "rejected"}


def iso_ok(s):
    if not isinstance(s, str) or len(s) < 10:
        return False
    y, m, d = s[0:4], s[5:7], s[8:10]
    if not (y.isdigit() and m.isdigit() and d.isdigit()):
        return False
    if s[4] != "-" or s[7] != "-":
        return False
    return 1 <= int(m) <= 12 and 1 <= int(d) <= 31


def fail(errors, msg):
    errors.append(msg)


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else "seed"
    errors = []

    def load(name):
        path = os.path.join(root, name)
        if not os.path.exists(path):
            fail(errors, f"missing file: {path}")
            return None
        try:
            with open(path, encoding="utf-8") as fh:
                return json.load(fh)
        except json.JSONDecodeError as exc:
            fail(errors, f"{path}: invalid JSON ({exc})")
            return None

    brand = load("brand.json")
    docs = load("source_documents.json")
    facts = load("facts.json")
    if errors:
        return report(errors, {})

    product_ids = {p["product_id"] for p in brand["products"]}
    doc_ids = {d["document_id"] for d in docs}
    version_ids = {d["version_id"] for d in docs}
    version_to_doc = {d["version_id"]: d["document_id"] for d in docs}

    # --- facts -------------------------------------------------------------
    seen = Counter()
    by_fact = defaultdict(list)
    for i, f in enumerate(facts):
        tag = f.get("fact_id", f"row {i}")
        missing = [k for k in REQUIRED_FACT if k not in f or f[k] in (None, "")]
        if missing:
            fail(errors, f"{tag} v{f.get('version')}: missing required field(s) {missing}")
            continue
        if f["status"] not in STATUSES:
            fail(errors, f"{tag}: status {f['status']!r} not in {sorted(STATUSES)}")
        if f["product_id"] not in product_ids:
            fail(errors, f"{tag}: unknown product_id {f['product_id']!r}")
        if f["source_document_id"] not in doc_ids:
            fail(errors, f"{tag}: unknown source_document_id {f['source_document_id']!r}")
        if f["source_version_id"] not in version_ids:
            fail(errors, f"{tag}: unknown source_version_id {f['source_version_id']!r}")
        elif version_to_doc[f["source_version_id"]] != f["source_document_id"]:
            fail(errors, f"{tag}: version {f['source_version_id']} belongs to "
                         f"{version_to_doc[f['source_version_id']]}, not {f['source_document_id']}")
        for k in ("valid_from", "valid_until"):
            if not iso_ok(f[k]):
                fail(errors, f"{tag}: {k} {f[k]!r} is not an ISO date")
        if iso_ok(f["valid_from"]) and iso_ok(f["valid_until"]) and f["valid_from"] > f["valid_until"]:
            fail(errors, f"{tag}: valid_from {f['valid_from']} is after valid_until {f['valid_until']}")
        if not str(f["source_span"]).startswith("["):
            fail(errors, f"{tag}: source_span {f['source_span']!r} must look like [start-end]")
        seen[(f["fact_id"], f["version"])] += 1
        by_fact[f["fact_id"]].append(f)

    for key, n in seen.items():
        if n > 1:
            fail(errors, f"duplicate fact version {key} appears {n} times")

    for fid, rows in by_fact.items():
        versions = sorted(r["version"] for r in rows)
        if versions != list(range(versions[0], versions[0] + len(versions))):
            fail(errors, f"{fid}: versions {versions} are not contiguous")
        approved = [r for r in rows if r["status"] == "approved"]
        if len(approved) > 1:
            same = {r["version"] for r in approved}
            # more than one approved version is legal only if windows do not overlap
            spans = sorted((r["valid_from"], r["valid_until"], r["version"]) for r in approved)
            for a, b in zip(spans, spans[1:]):
                if b[0] <= a[1]:
                    fail(errors, f"{fid}: approved versions {a[2]} and {b[2]} have overlapping "
                                 f"validity windows ({a[0]}..{a[1]} vs {b[0]}..{b[1]})")

    # --- smoke cases -------------------------------------------------------
    smoke_path = os.path.join(root, "smoke_cases.jsonl")
    cases = []
    if not os.path.exists(smoke_path):
        fail(errors, f"missing file: {smoke_path}")
    else:
        with open(smoke_path, encoding="utf-8") as fh:
            for n, line in enumerate(fh, 1):
                line = line.strip()
                if not line:
                    continue
                try:
                    cases.append(json.loads(line))
                except json.JSONDecodeError as exc:
                    fail(errors, f"smoke_cases.jsonl line {n}: invalid JSON ({exc})")

    verdict_counts = Counter()
    for c in cases:
        cid = c.get("case_id", "?")
        if c.get("expected_verdict") not in VERDICTS:
            fail(errors, f"{cid}: expected_verdict {c.get('expected_verdict')!r} not a valid verdict")
        else:
            verdict_counts[c["expected_verdict"]] += 1
        if not iso_ok(c.get("review_date", "")):
            fail(errors, f"{cid}: review_date {c.get('review_date')!r} is not an ISO date")
        fid = c.get("expected_fact_id")
        if fid and fid not in by_fact:
            fail(errors, f"{cid}: expected_fact_id {fid!r} does not exist in facts.json")
        if c.get("expected_verdict") in {"SUPPORTED", "CONTRADICTED", "STALE", "CONFLICTING"} and not fid:
            fail(errors, f"{cid}: verdict {c['expected_verdict']} requires an expected_fact_id")

    stats = {
        "facts": len(facts),
        "fact_ids": len(by_fact),
        "documents": len(docs),
        "smoke_cases": len(cases),
        "verdict_spread": dict(sorted(verdict_counts.items())),
    }
    return report(errors, stats)


def report(errors, stats):
    if errors:
        print(f"FAIL — {len(errors)} problem(s)\n")
        for e in errors[:40]:
            print("  -", e)
        if len(errors) > 40:
            print(f"  ... and {len(errors) - 40} more")
        return 1
    print("PASS")
    for k, v in stats.items():
        print(f"  {k}: {v}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
