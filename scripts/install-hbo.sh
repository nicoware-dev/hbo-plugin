#!/usr/bin/env bash
# install-hbo.sh — Install HBO Plugin system (plugin + bundled symlink + profiles)
# Usage: ./scripts/install-hbo.sh [--with-demo] [--build] [--skip-profiles] [--skip-symlink]
#        ./scripts/install-hbo.sh --plugin-source git [--repo-url URL]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
LIB="$SCRIPT_DIR/lib/hermes-paths.sh"

WITH_DEMO=false
DO_BUILD=false
SKIP_PROFILES=false
SKIP_SYMLINK=false
PLUGIN_SOURCE="local"
REPO_URL="${HBO_REPO_URL:-nicoware-dev/hbo-plugin/plugin/hbo-plugin}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --with-demo) WITH_DEMO=true ;;
    --build) DO_BUILD=true ;;
    --skip-profiles) SKIP_PROFILES=true ;;
    --skip-symlink) SKIP_SYMLINK=true ;;
    --plugin-source) PLUGIN_SOURCE="${2:?}"; shift ;;
    --repo-url) REPO_URL="${2:?}"; shift ;;
    --repo-root) REPO_ROOT="${2:?}"; shift ;;
    -h|--help)
      echo "Usage: $0 [--with-demo] [--build] [--skip-profiles] [--skip-symlink]"
      echo "       [--plugin-source local|git] [--repo-url owner/repo/subpath]"
      exit 0
      ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
  shift
done

# shellcheck source=lib/hermes-paths.sh
source "$LIB"
require_hermes_cli
init_hermes_paths

PLUGIN_SRC="$REPO_ROOT/plugin/hbo-plugin"
DIST="$PLUGIN_SRC/dashboard/dist/index.js"

echo "=== HBO Plugin install ==="
echo "Hermes home: $HERMES_HOME"
hermes --version 2>/dev/null | head -1 || true

if [[ "$DO_BUILD" == true ]] || [[ ! -f "$DIST" ]]; then
  echo "Building dashboard..."
  (cd "$REPO_ROOT" && pnpm build:dashboard)
fi

if [[ ! -f "$PLUGIN_SRC/plugin.yaml" ]]; then
  echo "ERROR: plugin.yaml not found at $PLUGIN_SRC" >&2
  exit 1
fi

if [[ "$PLUGIN_SOURCE" == "git" ]]; then
  echo "Installing plugin via Hermes CLI from $REPO_URL ..."
  hermes plugins install "$REPO_URL" --enable --force
else
  echo "Syncing plugin from repo..."
  bash "$SCRIPT_DIR/sync-plugin.sh"
fi

if [[ "$SKIP_SYMLINK" != true ]]; then
  link_bundled_plugin
else
  echo "⚠ Skipped bundled symlink (--skip-symlink) — dashboard API may 404"
fi

echo "Enabling plugin..."
hermes plugins enable hbo-plugin 2>/dev/null || true

if [[ "$SKIP_PROFILES" != true ]]; then
  echo "Installing profile distributions..."
  hermes profile install "$REPO_ROOT/profiles/sales-ops-agent" -y
  hermes profile install "$REPO_ROOT/profiles/growth-agent" -y
  hermes profile install "$REPO_ROOT/profiles/ops-lead-agent" -y
  echo "✓ Profiles: sales-ops-agent, growth-agent, ops-lead-agent"
fi

if [[ "$WITH_DEMO" == true ]]; then
  echo "Loading demo data..."
  python "$SCRIPT_DIR/demo_reset.py"
fi

echo ""
bash "$SCRIPT_DIR/verify-hbo.sh" || true

echo ""
echo "=== Install complete ==="
echo "⚠ Restart dashboard so API routes reload:"
echo "   hermes dashboard --stop && hermes dashboard --no-open"
echo "→ Then verify: curl http://127.0.0.1:9119/api/plugins/hbo-plugin/health"
