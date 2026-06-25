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
        ("sources.composio_client", "sources/composio_client.py"),
        ("sources.gmail", "sources/gmail.py"),
        ("sources.bridge", "sources/bridge.py"),
        ("sources.sheets", "sources/sheets.py"),
        ("sources.sync", "sources/sync.py"),
        ("mutations", "mutations.py"),
        ("execution", "execution.py"),
        ("automations", "automations.py"),
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
    assert result["pendingActions"] == 4


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
    assert workspace["pendingActions"] == 4


@pytest.mark.asyncio
async def test_create_lead(api_module):
    result = await api_module.create_lead(
        {
            "name": "API Lead",
            "source": "test",
            "segment": "commerce",
            "score": 77,
            "priority": "high",
            "status": "new",
            "ownerAgentId": "sales-ops-agent",
            "recommendedAction": "Call back",
        }
    )
    assert result["success"] is True
    leads = await api_module.get_leads()
    names = [l["name"] for l in leads["leads"]]
    assert "API Lead" in names


@pytest.mark.asyncio
async def test_update_lead(api_module):
    created = await api_module.create_lead({"name": "To Update", "ownerAgentId": "growth-agent"})
    lead_id = created["lead"]["id"]
    result = await api_module.update_lead(lead_id, {"status": "hot", "score": 99})
    assert result["success"] is True
    assert result["lead"]["status"] == "hot"


@pytest.mark.asyncio
async def test_create_and_delete_action(api_module):
    created = await api_module.create_action(
        {"title": "Test action", "agentId": "ops-lead-agent", "risk": "low", "description": "x"}
    )
    assert created["success"] is True
    action_id = created["action"]["id"]
    deleted = await api_module.delete_action(action_id)
    assert deleted["success"] is True


@pytest.mark.asyncio
async def test_create_and_resolve_signal(api_module):
    created = await api_module.create_signal(
        {"type": "custom", "summary": "Test signal", "ownerAgentId": "sales-ops-agent"}
    )
    assert created["success"] is True
    signal_id = created["signal"]["id"]
    resolved = await api_module.resolve_signal(signal_id)
    assert resolved["success"] is True
    open_signals = await api_module.get_signals(open_only=True)
    ids = [s["id"] for s in open_signals["signals"]]
    assert signal_id not in ids


@pytest.mark.asyncio
async def test_set_bridge_mode_api(api_module):
    result = await api_module.set_bridge_mode({"mode": "hybrid"})
    assert result["success"] is True
    assert result["mode"] == "hybrid"
    status = await api_module.get_bridge_status()
    assert status["mode"] == "hybrid"


@pytest.mark.asyncio
async def test_get_stats(api_module):
    result = await api_module.get_stats()
    assert "funnel" in result
    assert "segments" in result
    assert "auditTimeline" in result
    assert result["totalLeads"] == 12


@pytest.mark.asyncio
async def test_business_context(api_module):
    saved = await api_module.save_business_context({"businessName": "Test Co"})
    assert saved["success"] is True
    ctx = await api_module.get_business_context()
    assert ctx["businessName"] == "Test Co"


@pytest.mark.asyncio
async def test_get_automations(api_module):
    result = await api_module.get_automations()
    assert len(result["automations"]) == 6
    assert "sales-source-sync" in result["recommendedOrder"]
    daily = next(a for a in result["automations"] if a["id"] == "daily-ops-briefing")
    assert "hermes cron add" in daily["enableCommand"]


@pytest.mark.asyncio
async def test_get_conversations(api_module):
    result = await api_module.get_conversations()
    assert len(result["conversations"]) >= 2
    assert any(c.get("messages") for c in result["conversations"])


@pytest.mark.asyncio
async def test_get_conversation_by_id(api_module):
    result = await api_module.get_conversation("conv_001")
    assert result["success"] is True
    assert result["conversation"]["id"] == "conv_001"
    missing = await api_module.get_conversation("conv_missing")
    assert missing["success"] is False
