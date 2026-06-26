#!/usr/bin/env bash
# hermes-paths.sh — Resolve Hermes directories for HBO Plugin install/sync scripts.

PLUGIN_NAME="${HBO_PLUGIN_NAME:-hbo-plugin}"

resolve_hermes_home() {
  if [[ -n "${HERMES_HOME:-}" ]]; then
    echo "$HERMES_HOME"
    return 0
  fi
  if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    if [[ -n "${LOCALAPPDATA:-}" ]]; then
      echo "$LOCALAPPDATA/hermes"
      return 0
    fi
  fi
  echo "$HOME/.hermes"
}

init_hermes_paths() {
  HERMES_HOME="$(resolve_hermes_home)"
  USER_PLUGINS="$HERMES_HOME/plugins"
  BUNDLED_PLUGINS="$HERMES_HOME/hermes-agent/plugins"
  USER_PLUGIN_DIR="$USER_PLUGINS/$PLUGIN_NAME"
  BUNDLED_PLUGIN_LINK="$BUNDLED_PLUGINS/$PLUGIN_NAME"
  export HERMES_HOME USER_PLUGINS BUNDLED_PLUGINS USER_PLUGIN_DIR BUNDLED_PLUGIN_LINK
}

require_hermes_cli() {
  if ! command -v hermes >/dev/null 2>&1; then
    echo "ERROR: hermes CLI not found in PATH" >&2
    exit 1
  fi
}

link_bundled_plugin() {
  init_hermes_paths
  if [[ ! -d "$USER_PLUGIN_DIR" ]]; then
    echo "ERROR: User plugin not found at $USER_PLUGIN_DIR (sync or install first)" >&2
    return 1
  fi
  if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    local script_dir ps1_path
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    if command -v cygpath >/dev/null 2>&1; then
      ps1_path="$(cygpath -w "$script_dir/hermes-paths.ps1")"
    else
      ps1_path="$(cd "$script_dir" && pwd -W 2>/dev/null)/hermes-paths.ps1"
    fi
    powershell -NoProfile -ExecutionPolicy Bypass -Command \
      ". '$ps1_path'; Link-BundledPlugin"
    return $?
  fi
  mkdir -p "$BUNDLED_PLUGINS"
  if [[ -L "$BUNDLED_PLUGIN_LINK" || -e "$BUNDLED_PLUGIN_LINK" ]]; then
    rm -rf "$BUNDLED_PLUGIN_LINK"
  fi
  ln -sfn "$USER_PLUGIN_DIR" "$BUNDLED_PLUGIN_LINK"
  echo "✓ Bundled symlink: $BUNDLED_PLUGIN_LINK -> $USER_PLUGIN_DIR"
}

bundled_link_ok() {
  init_hermes_paths
  [[ -f "$BUNDLED_PLUGIN_LINK/plugin.yaml" ]] || return 1
  if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    local script_dir ps1_path
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    if command -v cygpath >/dev/null 2>&1; then
      ps1_path="$(cygpath -w "$script_dir/hermes-paths.ps1")"
    else
      ps1_path="$(cd "$script_dir" && pwd -W 2>/dev/null)/hermes-paths.ps1"
    fi
    powershell -NoProfile -ExecutionPolicy Bypass -Command \
      ". '$ps1_path'; exit ([int](-not (Test-BundledLinkOk)))"
    return $?
  fi
  [[ -e "$BUNDLED_PLUGIN_LINK" ]] || return 1
  if [[ -L "$BUNDLED_PLUGIN_LINK" ]]; then
    local target
    target="$(readlink -f "$BUNDLED_PLUGIN_LINK" 2>/dev/null || readlink "$BUNDLED_PLUGIN_LINK")"
    [[ "$target" == "$USER_PLUGIN_DIR" ]] || [[ "$(readlink "$BUNDLED_PLUGIN_LINK")" == "$USER_PLUGIN_DIR" ]]
    return $?
  fi
  [[ -d "$BUNDLED_PLUGIN_LINK" ]]
}
