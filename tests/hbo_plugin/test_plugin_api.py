"""Tests for dashboard plugin_api route handlers."""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

import pytest

PLUGIN_ROOT = Path(__file__).resolve().parents[2] / "plugin" / "hbo-plugin"
DASHBOARD_DIR = PLUGIN_ROOT / "dashboard"
PACKAGE = "hbo_plugin"


def _load_plugin_modules():
    import types

    if PACKAGE not in sys.modules:
        sys.modules[PACKAGE] = types.ModuleType(PACKAGE)

    for name, filename in (
        ("schemas", "schemas.py"),
        ("state", "state.py"),
        ("workflows", "workflows.py"),
        ("business_rules", "business_rules.py"),
    ):
        full_name = f"{PACKAGE}.{name}"
        if full_name in sys.modules:
            continue
        path = PLUGIN_ROOT / filename
        spec = importlib.util.spec_from_file_location(full_name, path)
        assert spec and spec.loader
        mod = importlib.util.module_from_spec(spec)
        mod.__package__ = PACKAGE
        sys.modules[full_name] = mod
        spec.loader.exec_module(mod)


def _load_plugin_api(state_mod, rules_mod):
    path = DASHBOARD_DIR / "plugin_api.py"
    spec = importlib.util.spec_from_file_location("hbo_plugin_api_test", path)
    assert spec and spec.loader
    mod = importlib.util.module_from_spec(spec)
    sys.modules["hbo_plugin_api_test"] = mod
    spec.loader.exec_module(mod)
    mod._state = state_mod
    mod._rules = rules_mod
    return mod


@pytest.fixture
def api_module(demo_data_dir):
    _load_plugin_modules()
    state_mod = sys.modules[f"{PACKAGE}.state"]
    rules_mod = sys.modules[f"{PACKAGE}.business_rules"]
    return _load_plugin_api(state_mod, rules_mod)


@pytest.mark.asyncio
async def test_get_workspace(api_module):
    result = await api_module.get_workspace()
    assert result["workspaceName"] == "Business Ops Demo"
    assert result["pendingActions"] == 3


@pytest.mark.asyncio
async def test_get_workflows(api_module):
    result = await api_module.get_workflows()
    assert len(result["workflows"]) == 3


@pytest.mark.asyncio
async def test_run_workflow_via_api(api_module):
    result = await api_module.run_workflow("inbound_sales")
    assert result["success"] is True
    assert "outputs" in result


@pytest.mark.asyncio
async def test_approve_via_api(api_module):
    result = await api_module.approve_action("act_001")
    assert result["success"] is True
    actions = await api_module.get_actions(status="pending")
    ids = [a["id"] for a in actions["actions"]]
    assert "act_001" not in ids


@pytest.mark.asyncio
async def test_reset_demo(api_module):
    await api_module.approve_action("act_001")
    result = await api_module.reset_demo()
    assert result["success"] is True
    workspace = await api_module.get_workspace()
    assert workspace["pendingActions"] == 3
