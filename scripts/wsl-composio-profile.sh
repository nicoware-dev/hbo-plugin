#!/usr/bin/env bash
set -euo pipefail

PROFILE="${HOME}/.profile"
MARKER="# Composio CLI (login/non-interactive shells)"

# Remove prior broken or duplicate Composio blocks
if [[ -f "$PROFILE" ]]; then
  awk -v marker="$MARKER" '
    $0 == marker { skip=1; next }
    skip && /^export COMPOSIO_INSTALL_DIR=/ { next }
    skip && /^export PATH="\$COMPOSIO_INSTALL_DIR:/ { skip=0; next }
    skip && /^export PATH=/ { skip=0; next }
    { print }
  ' "$PROFILE" > "${PROFILE}.tmp"
  mv "${PROFILE}.tmp" "$PROFILE"
fi

{
  echo ""
  echo "$MARKER"
  echo 'export COMPOSIO_INSTALL_DIR="$HOME/.composio"'
  echo 'export PATH="$COMPOSIO_INSTALL_DIR:$PATH"'
} >> "$PROFILE"

echo "Updated $PROFILE"
