"""Pytest fixtures for HBO Plugin tests."""

from __future__ import annotations

import importlib.util
import shutil
import sys
import types
from pathlib import Path

import pytest

PLUGIN_ROOT = Path(__file__).resolve().parents[2] / "plugin" / "hbo-plugin"
ORIGINAL_DIR = PLUGIN_ROOT / "data" / "business-ops-demo-original"
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
    if "." in name:
        parent = name.rsplit(".", 1)[0]
        _ensure_package(parent, PLUGIN_ROOT / parent.replace(".", "/"))
    path = PLUGIN_ROOT / rel_path
    spec = importlib.util.spec_from_file_location(full_name, path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Cannot load {path}")
    mod = importlib.util.module_from_spec(spec)
    mod.__package__ = f"{PACKAGE}.{name.rsplit('.', 1)[0]}" if "." in name else PACKAGE
    sys.modules[full_name] = mod
    spec.loader.exec_module(mod)
    return mod


def load_plugin_modules():
    _ensure_package("")
    _load_module("schemas", "schemas.py")
    _load_module("state", "state.py")
    _load_module("workflows", "workflows.py")
    _ensure_package("sources", PLUGIN_ROOT / "sources")
    _load_module("sources.composio_client", "sources/composio_client.py")
    _load_module("sources.gmail", "sources/gmail.py")
    _load_module("sources.bridge", "sources/bridge.py")
    _load_module("sources.sheets", "sources/sheets.py")
    _load_module("sources.sync", "sources/sync.py")
    _load_module("mutations", "mutations.py")
    _load_module("execution", "execution.py")
    rules = _load_module("business_rules", "business_rules.py")
    _load_module("tools", "tools.py")
    return rules


@pytest.fixture
def demo_data_dir(tmp_path, monkeypatch):
    """Isolated copy of bundled demo JSON for each test."""
    target = tmp_path / "business-ops-demo"
    target.mkdir()
    for path in ORIGINAL_DIR.glob("*.json"):
        shutil.copy(path, target / path.name)
    if not (target / "workflow_runs.json").exists():
        (target / "workflow_runs.json").write_text("{}", encoding="utf-8")

    load_plugin_modules()
    state = sys.modules[f"{PACKAGE}.state"]
    monkeypatch.setattr(state, "DATA_DIR", target)
    return target


@pytest.fixture
def rules_module(demo_data_dir):
    return sys.modules[f"{PACKAGE}.business_rules"]


@pytest.fixture
def state_module(demo_data_dir):
    return sys.modules[f"{PACKAGE}.state"]
