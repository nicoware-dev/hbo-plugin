#!/usr/bin/env python3
"""Reset HBO Plugin demo data from bundled originals (no pip install required)."""

from __future__ import annotations

import importlib.util
import sys
import types
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
PLUGIN_ROOT = REPO_ROOT / "plugin" / "hbo-plugin"
PACKAGE = "hbo_plugin"


def _ensure_package(name: str, path: Path | None = None) -> None:
    full = f"{PACKAGE}.{name}" if name else PACKAGE
    if full in sys.modules:
        return
    mod = types.ModuleType(full)
    if path is not None:
        mod.__path__ = [str(path)]  # type: ignore[attr-defined]
    sys.modules[full] = mod


def _load_module(name: str, rel_path: str):
    full_name = f"{PACKAGE}.{name}"
    if full_name in sys.modules:
        return sys.modules[full_name]
    path = PLUGIN_ROOT / rel_path
    spec = importlib.util.spec_from_file_location(full_name, path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Cannot load {path}")
    mod = importlib.util.module_from_spec(spec)
    mod.__package__ = PACKAGE
    sys.modules[full_name] = mod
    spec.loader.exec_module(mod)
    return mod


def reset_demo_data() -> dict:
    _ensure_package("")
    state = _load_module("state", "state.py")
    return state.load_demo_data()


def main() -> int:
    result = reset_demo_data()
    print("Demo reset:", result.get("message", result))
    return 0 if result.get("success", True) else 1


if __name__ == "__main__":
    raise SystemExit(main())
