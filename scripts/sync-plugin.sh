#!/usr/bin/env bash
# sync-plugin.sh — Sync HBO Plugin from repo to Hermes plugins directory
# Usage: ./scripts/sync-plugin.sh
#
# Copies the plugin from the repo to ~/.hermes/plugins/hbo-plugin
# so changes during development are picked up by Hermes.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

SRC="$REPO_ROOT/plugin/hbo-plugin"

# Detect Hermes home
if [[ -n "${HERMES_HOME:-}" ]]; then
    DEST="$HERMES_HOME/plugins/hbo-plugin"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    DEST="$LOCALAPPDATA/hermes/plugins/hbo-plugin"
else
    DEST="$HOME/.hermes/plugins/hbo-plugin"
fi

if [[ ! -d "$SRC" ]]; then
    echo "ERROR: Plugin source not found at $SRC"
    exit 1
fi

echo "Syncing HBO Plugin..."
echo "  From: $SRC"
echo "  To:   $DEST"

# Create dest if needed
mkdir -p "$DEST"

# Copy (preserve original/ backup directory)
rsync -av --delete \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='node_modules' \
    --exclude='.pnpm-store' \
    "$SRC/" "$DEST/"

echo ""
echo "✓ Plugin synced to $DEST"
echo "  Restart Hermes or run /restart to pick up changes."
