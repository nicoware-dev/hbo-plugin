"""Multi-platform Composio CLI client.

Windows  → WSL Ubuntu (composio CLI runs inside WSL), same as scripts/composio.ps1
macOS    → native composio CLI
Linux    → native composio CLI
"""

from __future__ import annotations

import json
import os
import shlex
import shutil
import subprocess
import sys
import uuid
from typing import Any


def _wsl_distro() -> str:
    return os.environ.get("COMPOSIO_WSL_DISTRO", "Ubuntu")


def _has_wsl() -> bool:
    if sys.platform != "win32":
        return False
    return shutil.which("wsl") is not None or shutil.which("wsl.exe") is not None


def _has_composio() -> bool:
    return shutil.which("composio") is not None


def _has_composio_wsl() -> bool:
    if not _has_wsl():
        return False
    distro = _wsl_distro()
    result = subprocess.run(
        ["wsl.exe", "-d", distro, "--", "bash", "-lc", "command -v composio"],
        capture_output=True,
        text=True,
        timeout=15,
    )
    return result.returncode == 0 and "composio" in result.stdout


def is_available() -> bool:
    return _has_composio() or _has_composio_wsl()


def platform() -> str:
    if sys.platform == "win32":
        if _has_composio_wsl():
            return "windows-wsl"
        if _has_composio():
            return "windows-native"
        return "windows-unavailable"
    if _has_composio():
        return "native"
    return "unavailable"


def run_argv(subcommand: list[str], data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Run composio with argv list; optional JSON payload without shell interpolation."""
    args = list(subcommand)
    if data is not None:
        args.extend(["-d", json.dumps(data, ensure_ascii=False)])

    if sys.platform == "win32" and _has_composio_wsl():
        return _run_wsl_argv(args)
    if _has_composio():
        return _run_native_argv(args)
    raise RuntimeError(
        "Composio CLI not found. Install it:\n"
        "  Windows (WSL):  curl -fsSL https://composio.dev/install | bash\n"
        "  macOS/Linux:     curl -fsSL https://composio.dev/install | bash\n"
        "See: https://docs.composio.dev/docs/cli"
    )


def run(args: str) -> dict[str, Any]:
    """Run a composio CLI command string (simple static commands only — not for user input)."""
    if sys.platform == "win32" and _has_composio_wsl():
        if _is_simple_command(args):
            return _run_wsl_direct(args)
        return _run_wsl_script(args)
    if _has_composio():
        return _run_native(args)
    raise RuntimeError(
        "Composio CLI not found. Install it:\n"
        "  Windows (WSL):  curl -fsSL https://composio.dev/install | bash\n"
        "  macOS/Linux:     curl -fsSL https://composio.dev/install | bash\n"
        "See: https://docs.composio.dev/docs/cli"
    )


def _is_simple_command(args: str) -> bool:
    """Commands safe to run via direct bash -lc without a temp script."""
    if not args.strip():
        return False
    return "'" not in args and '"' not in args


def _run_wsl_direct(args: str) -> dict[str, Any]:
    """Run composio inside WSL login shell (matches scripts/composio.ps1)."""
    distro = _wsl_distro()
    result = subprocess.run(
        ["wsl.exe", "-d", distro, "--", "bash", "-lc", f"composio {args}"],
        capture_output=True,
        text=True,
        timeout=60,
    )
    if result.returncode != 0:
        raise RuntimeError(f"composio failed ({result.returncode}): {result.stderr.strip()}")
    return _parse_json(result.stdout)


def _run_wsl_argv(args: list[str]) -> dict[str, Any]:
    """Run composio in WSL with quoted argv (safe for JSON payloads)."""
    distro = _wsl_distro()
    script_name = f"_hbo_composio_{uuid.uuid4().hex[:8]}.sh"
    cmd_line = " ".join(shlex.quote(x) for x in ["composio", *args])
    script_content = f"#!/bin/bash\nset -e\n{cmd_line}\n"

    write = subprocess.run(
        ["wsl.exe", "-d", distro, "--", "bash", "-lc", f"cat > ~/{script_name}"],
        input=script_content.encode("utf-8"),
        capture_output=True,
        timeout=15,
    )
    if write.returncode != 0:
        raise RuntimeError(f"Failed to write WSL script: {write.stderr.decode()}")

    result = subprocess.run(
        [
            "wsl.exe",
            "-d",
            distro,
            "--",
            "bash",
            "-lc",
            f"bash ~/{script_name}; rc=$?; rm -f ~/{script_name}; exit $rc",
        ],
        capture_output=True,
        text=True,
        timeout=60,
    )
    if result.returncode != 0:
        raise RuntimeError(f"composio failed ({result.returncode}): {result.stderr.strip()}")
    return _parse_json(result.stdout)


def _run_wsl_script(args: str) -> dict[str, Any]:
    """Run composio via a temp bash script in WSL (legacy string path)."""
    distro = _wsl_distro()
    script_name = f"_hbo_composio_{uuid.uuid4().hex[:8]}.sh"
    script_content = f"#!/bin/bash\ncomposio {args}\n"

    write = subprocess.run(
        ["wsl.exe", "-d", distro, "--", "bash", "-lc", f"cat > ~/{script_name}"],
        input=script_content.encode("utf-8"),
        capture_output=True,
        timeout=15,
    )
    if write.returncode != 0:
        raise RuntimeError(f"Failed to write WSL script: {write.stderr.decode()}")

    result = subprocess.run(
        [
            "wsl.exe",
            "-d",
            distro,
            "--",
            "bash",
            "-lc",
            f"bash ~/{script_name}; rc=$?; rm -f ~/{script_name}; exit $rc",
        ],
        capture_output=True,
        text=True,
        timeout=60,
    )
    if result.returncode != 0:
        raise RuntimeError(f"composio failed ({result.returncode}): {result.stderr.strip()}")
    return _parse_json(result.stdout)


def _run_native_argv(args: list[str]) -> dict[str, Any]:
    cmd = ["composio", *args]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if result.returncode != 0:
        raise RuntimeError(f"composio failed ({result.returncode}): {result.stderr.strip()}")
    return _parse_json(result.stdout)


def _run_native(args: str) -> dict[str, Any]:
    cmd = ["composio"] + _split_args(args)
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if result.returncode != 0:
        raise RuntimeError(f"composio failed ({result.returncode}): {result.stderr.strip()}")
    return _parse_json(result.stdout)


def _parse_json(stdout: str) -> dict[str, Any]:
    text = stdout.strip()
    if not text:
        return {}
    return json.loads(text)


def _split_args(args: str) -> list[str]:
    try:
        return shlex.split(args)
    except ValueError:
        return args.split()
