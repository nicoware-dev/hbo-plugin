#!/usr/bin/env bash
# sync-plugin.sh — Sync HBO Plugin from repo to Hermes plugins directory
# Usage: ./scripts/sync-plugin.sh
#
# Copies the plugin from the repo to ~/.hermes/plugins/hbo-plugin
# and creates the bundled symlink required for dashboard API routes.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
# shellcheck source=lib/hermes-paths.sh
source "$SCRIPT_DIR/lib/hermes-paths.sh"

SRC="$REPO_ROOT/plugin/hbo-plugin"
init_hermes_paths
DEST="$USER_PLUGIN_DIR"

if [[ ! -d "$SRC" ]]; then
    echo "ERROR: Plugin source not found at $SRC"
    exit 1
fi

echo "Syncing HBO Plugin..."
echo "  From: $SRC"
echo "  To:   $DEST"

mkdir -p "$DEST"

if command -v rsync >/dev/null 2>&1; then
  rsync -av --delete \
      --exclude='__pycache__' \
      --exclude='*.pyc' \
      --exclude='node_modules' \
      --exclude='.pnpm-store' \
      "$SRC/" "$DEST/"
else
  echo "  (rsync not found — using cp)"
  rm -rf "$DEST"
  mkdir -p "$DEST"
  cp -R "$SRC/." "$DEST/"
  rm -rf "$DEST/__pycache__" "$DEST/node_modules" 2>/dev/null || true
fi

link_bundled_plugin

echo ""
echo "✓ Plugin synced to $DEST"
echo "  Restart Hermes dashboard: hermes dashboard --stop && hermes dashboard --no-open"
