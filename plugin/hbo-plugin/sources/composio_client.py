"""Multi-platform Composio CLI client.

Windows  → WSL Ubuntu (composio CLI runs inside WSL)
macOS    → native composio CLI
Linux    → native composio CLI

Falls back gracefully if composio is not installed.
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
import uuid
from typing import Any


def _has_wsl() -> bool:
    """Check if WSL is available on Windows."""
    if sys.platform != "win32":
        return False
    return shutil.which("wsl") is not None


def _has_composio() -> bool:
    """Check if composio CLI is available on PATH."""
    return shutil.which("composio") is not None


def _has_composio_wsl() -> bool:
    """Check if composio CLI is available inside WSL."""
    if not _has_wsl():
        return False
    result = subprocess.run(
        'wsl bash -lc "which composio"',
        shell=True, capture_output=True, text=True, timeout=10,
    )
    return result.returncode == 0 and "composio" in result.stdout


def is_available() -> bool:
    """Check if Composio is accessible on this platform."""
    return _has_composio() or _has_composio_wsl()


def platform() -> str:
    """Return the platform strategy being used."""
    if sys.platform == "win32":
        if _has_composio_wsl():
            return "windows-wsl"
        if _has_composio():
            return "windows-native"
        return "windows-unavailable"
    if _has_composio():
        return "native"
    return "unavailable"


def run(args: str) -> dict[str, Any]:
    """Run a composio CLI command and return parsed JSON.

    On Windows: writes a temp script to WSL home to avoid shell-quoting issues.
    On macOS/Linux: runs composio directly on PATH.
    """
    if sys.platform == "win32" and _has_composio_wsl():
        return _run_wsl(args)
    if _has_composio():
        return _run_native(args)
    raise RuntimeError(
        "Composio CLI not found. Install it:\n"
        "  Windows (WSL):  curl -fsSL https://composio.dev/install | bash\n"
        "  macOS/Linux:     curl -fsSL https://composio.dev/install | bash\n"
        "See: https://docs.composio.dev/docs/cli"
    )


def _run_native(args: str) -> dict[str, Any]:
    """Run composio CLI directly (macOS/Linux)."""
    cmd = ["composio"] + _split_args(args)
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if result.returncode != 0:
        raise RuntimeError(f"composio failed ({result.returncode}): {result.stderr.strip()}")
    return json.loads(result.stdout)


def _run_wsl(args: str) -> dict[str, Any]:
    """Run composio CLI via WSL (Windows).

    Writes a temp bash script to WSL home to avoid Windows shell-quoting issues
    with nested JSON in -d arguments.
    """
    script_name = f"_hbo_composio_{uuid.uuid4().hex[:8]}.sh"
    script_content = f"#!/bin/bash\ncomposio {args}\n"

    # Write script to WSL home
    write_cmd = f'wsl bash -lc "cat > ~/{script_name}"'
    proc = subprocess.run(
        write_cmd, shell=True, input=script_content,
        capture_output=True, text=True, timeout=10,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"Failed to write WSL script: {proc.stderr}")

    # Execute and clean up
    cmd = f'wsl bash -lc "bash ~/{script_name} && rm ~/{script_name}"'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=60)

    if result.returncode != 0:
        raise RuntimeError(f"composio failed ({result.returncode}): {result.stderr.strip()}")
    return json.loads(result.stdout)


def _split_args(args: str) -> list[str]:
    """Split args string into list, respecting quoted sections."""
    import shlex
    try:
        return shlex.split(args)
    except ValueError:
        return args.split()
