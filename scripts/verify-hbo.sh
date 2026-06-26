#!/usr/bin/env bash
# verify-hbo.sh — Verify HBO Plugin install (symlink, enable, optional API health)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/hermes-paths.sh
source "$SCRIPT_DIR/lib/hermes-paths.sh"

init_hermes_paths
FAIL=0
HEALTH_URL="${HBO_HEALTH_URL:-http://127.0.0.1:9119/api/plugins/hbo-plugin/health}"

echo "=== HBO Plugin verify ==="

if [[ -d "$USER_PLUGIN_DIR" && -f "$USER_PLUGIN_DIR/plugin.yaml" ]]; then
  echo "✓ User plugin: $USER_PLUGIN_DIR"
else
  echo "✗ User plugin missing at $USER_PLUGIN_DIR" >&2
  FAIL=1
fi

if bundled_link_ok; then
  echo "✓ Bundled symlink: $BUNDLED_PLUGIN_LINK"
else
  echo "✗ Bundled symlink missing or wrong target" >&2
  echo "  Fix: ./scripts/install-hbo.sh or ./scripts/sync-plugin.sh" >&2
  FAIL=1
fi

PLUGIN_LIST="$(hermes plugins list 2>&1 || true)"
if echo "$PLUGIN_LIST" | grep -F "hbo-plugin" | grep -qi "enabled"; then
  echo "✓ Plugin enabled"
elif echo "$PLUGIN_LIST" | grep -Fq "hbo-plugin"; then
  echo "⚠ hbo-plugin installed but may not be enabled — run: hermes plugins enable hbo-plugin"
else
  echo "✗ hbo-plugin not found in hermes plugins list" >&2
  FAIL=1
fi

if command -v curl >/dev/null 2>&1; then
  HTTP_CODE="$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")"
  HTTP_CODE="${HTTP_CODE//$'\r'/}"
  if [[ "$HTTP_CODE" == "200" ]]; then
    echo "✓ API health: $HEALTH_URL"
  elif [[ "$HTTP_CODE" == "000" || "$HTTP_CODE" == "000000" ]]; then
    echo "⚠ Dashboard not reachable - restart: hermes dashboard --no-open"
  else
    echo "⚠ API health returned HTTP $HTTP_CODE (expected 200 after dashboard restart)"
    FAIL=1
  fi
else
  echo "⚠ curl not found — skip API health check"
fi

if [[ "$FAIL" -ne 0 ]]; then
  exit 1
fi
echo "All checks passed."
