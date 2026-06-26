#!/usr/bin/env bash
# check-doc-counts.sh — Verify code matches plugin/hbo-plugin/package-stats.yaml
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
STATS="$REPO_ROOT/plugin/hbo-plugin/package-stats.yaml"
INIT_PY="$REPO_ROOT/plugin/hbo-plugin/__init__.py"
TOOLS_PY="$REPO_ROOT/plugin/hbo-plugin/tools.py"

read_stat() { grep "^$1:" "$STATS" | awk '{print $2}'; }

EXPECTED_TOOLS="$(read_stat tools)"
EXPECTED_SKILLS="$(read_stat bundled_skills)"

ACTUAL_SKILLS="$(python - "$INIT_PY" <<'PY'
import re, sys
text = open(sys.argv[1], encoding="utf-8").read()
block = re.search(r"BUNDLED_SKILLS = \((.*?)\)", text, re.S).group(1)
print(len([s.strip().strip('"').strip("'") for s in block.split(",") if s.strip()]))
PY
)"

ACTUAL_TOOLS="$(grep -c '"name": "hbo_' "$TOOLS_PY")"

FAIL=0
if [[ "$EXPECTED_TOOLS" != "$ACTUAL_TOOLS" ]]; then
  echo "FAIL tools: stats=$EXPECTED_TOOLS code=$ACTUAL_TOOLS" >&2
  FAIL=1
else
  echo "OK tools: $ACTUAL_TOOLS"
fi
if [[ "$EXPECTED_SKILLS" != "$ACTUAL_SKILLS" ]]; then
  echo "FAIL bundled_skills: stats=$EXPECTED_SKILLS code=$ACTUAL_SKILLS" >&2
  FAIL=1
else
  echo "OK bundled_skills: $ACTUAL_SKILLS"
fi

for doc in skills.md plugin.md; do
  if grep -q "${EXPECTED_SKILLS} bundled skills" "$REPO_ROOT/apps/docs/docs/$doc"; then
    echo "OK $doc: skill count"
  else
    echo "FAIL $doc: missing '${EXPECTED_SKILLS} bundled skills'" >&2
    FAIL=1
  fi
done

if grep -q "${EXPECTED_TOOLS} HBO tools" "$REPO_ROOT/apps/docs/docs/plugin.md"; then
  echo "OK plugin.md: tool count"
else
  echo "FAIL plugin.md: missing '${EXPECTED_TOOLS} HBO tools'" >&2
  FAIL=1
fi

exit "$FAIL"
