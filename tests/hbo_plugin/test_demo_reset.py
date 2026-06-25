"""Tests for demo reset script."""

from __future__ import annotations

import importlib.util
import json
import shutil
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
SCRIPT_PATH = REPO_ROOT / "scripts" / "demo_reset.py"
ORIGINAL_DIR = REPO_ROOT / "plugin" / "hbo-plugin" / "data" / "business-ops-demo-original"


def _load_demo_reset_module():
    spec = importlib.util.spec_from_file_location("demo_reset", SCRIPT_PATH)
    assert spec and spec.loader
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


@pytest.fixture
def demo_reset_env(tmp_path, monkeypatch):
    target = tmp_path / "business-ops-demo"
    target.mkdir()
    for path in ORIGINAL_DIR.glob("*.json"):
        shutil.copy(path, target / path.name)

    demo_reset = _load_demo_reset_module()
    demo_reset._load_module("state", "state.py")
    state = sys.modules["hbo_plugin.state"]
    monkeypatch.setattr(state, "DATA_DIR", target)
    return demo_reset, target


def test_demo_reset_loads_state_and_resets(demo_reset_env):
    demo_reset, data_dir = demo_reset_env
    (data_dir / "leads.json").write_text("[]", encoding="utf-8")
    result = demo_reset.reset_demo_data()
    assert result.get("success", True)
    leads = json.loads((data_dir / "leads.json").read_text(encoding="utf-8"))
    assert len(leads) > 0


def test_demo_reset_main_exit_code(demo_reset_env):
    demo_reset, _ = demo_reset_env
    assert demo_reset.main() == 0
