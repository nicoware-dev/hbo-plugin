#!/usr/bin/env bash
# demo-reset.sh — Build, sync plugin, reset demo data
# Usage: ./scripts/demo-reset.sh [--build]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD=false

for arg in "$@"; do
  if [[ "$arg" == "--build" ]]; then
    BUILD=true
  fi
done

cd "$REPO_ROOT"

if [[ "$BUILD" == true ]] || [[ ! -f plugin/hbo-plugin/dashboard/dist/index.js ]]; then
  echo "Building dashboard..."
  pnpm build:dashboard
fi

echo "Syncing plugin to Hermes..."
bash "$SCRIPT_DIR/sync-plugin.sh"

echo "Resetting demo data..."
PYTHONPATH="$REPO_ROOT/plugin" python -c "
from hbo_plugin import state
result = state.load_demo_data()
print('Demo reset:', result.get('message', result))
"

echo ""
echo "✓ Demo reset complete."
echo "  Restart the Hermes dashboard to pick up API/plugin changes."
echo "  Open Business Ops → Setup to verify, or run hbo_load_demo_data in chat."
