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


def _load_module(name: str, filename: str):
    full_name = f"{PACKAGE}.{name}"
    if full_name in sys.modules:
        return sys.modules[full_name]
    path = PLUGIN_ROOT / filename
    spec = importlib.util.spec_from_file_location(full_name, path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Cannot load {path}")
    mod = importlib.util.module_from_spec(spec)
    mod.__package__ = PACKAGE
    sys.modules[full_name] = mod
    spec.loader.exec_module(mod)
    return mod


def load_plugin_modules():
    if PACKAGE not in sys.modules:
        sys.modules[PACKAGE] = types.ModuleType(PACKAGE)
    _load_module("schemas", "schemas.py")
    _load_module("state", "state.py")
    _load_module("workflows", "workflows.py")
    return _load_module("business_rules", "business_rules.py")


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
