#!/usr/bin/env bash
# Goal verifier for Proofline Round 2. Runs every gate and prints a checklist.
# Exits non-zero if any gate fails. Safe to re-run.
set -u -o pipefail
cd "$(dirname "$0")/.."

pass=0; fail=0; failed=()
run() {
  local name="$1"; shift
  if "$@" > /tmp/opencode/verify_goal.last 2>&1; then
    printf 'PASS  %s\n' "$name"; pass=$((pass+1))
  else
    printf 'FAIL  %s   (see /tmp/opencode/verify_goal.last)\n' "$name"; fail=$((fail+1)); failed+=("$name")
  fi
}

run "seed integrity"        python3 scripts/validate_seed.py seed/
run "typecheck"             npx tsc --noEmit
run "lint"                  npm run lint
run "unit tests"            npm test
run "build"                 npm run build
run "smoke gate (>=20/24)"  npm run smoke
run "e2e"                   npm run test:e2e

echo
echo "== $pass passed, $fail failed =="
if [ "$fail" -gt 0 ]; then printf 'failed: %s\n' "${failed[*]}"; exit 1; fi
echo "GOAL VERIFIED"
