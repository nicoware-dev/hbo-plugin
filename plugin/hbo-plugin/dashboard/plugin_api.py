"""FastAPI routes for the HBO Plugin dashboard extension.

Mounted at /api/plugins/hbo-plugin/ by Hermes (see hermes_cli/web_server.py).

Note: Hermes loads this file via importlib as a standalone module — not as part
of the plugin package — so imports must resolve from the plugin root explicitly.
"""

from __future__ import annotations

import importlib.util
import sys
import types
from pathlib import Path
from typing import Any

try:
    from fastapi import APIRouter, Body
except Exception:  # pragma: no cover - allows import without FastAPI in dev
    class APIRouter:  # type: ignore[no-redef]
        def get(self, *_args, **_kwargs):
            return lambda fn: fn

        def post(self, *_args, **_kwargs):
            return lambda fn: fn

        def put(self, *_args, **_kwargs):
            return lambda fn: fn

        def delete(self, *_args, **_kwargs):
            return lambda fn: fn

    def Body(default=None, **_kwargs):  # type: ignore[no-redef]
        return default

router = APIRouter()

_PLUGIN_ROOT = Path(__file__).resolve().parent.parent
_PACKAGE = "hbo_plugin"


def _load_plugin_modules():
    """Load plugin modules when Hermes imports this file standalone."""
    if _PACKAGE not in sys.modules:
        sys.modules[_PACKAGE] = types.ModuleType(_PACKAGE)

    def _ensure_pkg(name: str, subpath: str | None = None) -> None:
        full = f"{_PACKAGE}.{name}" if name else _PACKAGE
        if full not in sys.modules:
            mod = types.ModuleType(full)
            if subpath:
                mod.__path__ = [str(_PLUGIN_ROOT / subpath)]  # type: ignore[attr-defined]
            sys.modules[full] = mod

    loaded: dict[str, object] = {}
    for name, rel_path in (
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
        full_name = f"{_PACKAGE}.{name}"
        if full_name in sys.modules:
            loaded[name.split(".")[-1] if name == "business_rules" else name] = sys.modules[full_name]
            continue
        if name.startswith("sources."):
            _ensure_pkg("sources", "sources")
        path = _PLUGIN_ROOT / rel_path
        spec = importlib.util.spec_from_file_location(full_name, path)
        if spec is None or spec.loader is None:
            raise ImportError(f"Cannot load {path}")
        mod = importlib.util.module_from_spec(spec)
        mod.__package__ = f"{_PACKAGE}.{name.rsplit('.', 1)[0]}" if "." in name else _PACKAGE
        sys.modules[full_name] = mod
        spec.loader.exec_module(mod)
        key = name.split(".")[-1] if "." in name else name
        if name == "business_rules":
            loaded["business_rules"] = mod
        elif name == "automations":
            loaded["automations"] = mod
        elif name.startswith("sources."):
            loaded.setdefault("sources", sys.modules[f"{_PACKAGE}.sources"])
    if "state" not in loaded:
        loaded["state"] = sys.modules[f"{_PACKAGE}.state"]
    if "business_rules" not in loaded:
        loaded["business_rules"] = sys.modules[f"{_PACKAGE}.business_rules"]
    return loaded


_modules = _load_plugin_modules()
_state = _modules["state"]
_rules = _modules["business_rules"]


@router.get("/workflows")
async def get_workflows():
    return {"workflows": _state.list_workflows()}


@router.get("/signals")
async def get_signals(open_only: bool = True):
    return {"signals": _state.list_signals(open_only=open_only)}


@router.post("/demo/reset")
async def reset_demo():
    return _state.load_demo_data()


@router.get("/workspace")
async def get_workspace():
    return _state.get_workspace_summary()


@router.get("/agents")
async def get_agents():
    return {"agents": _state.list_agents()}


@router.get("/leads")
async def get_leads():
    return {"leads": _state.list_leads()}


@router.post("/leads")
async def create_lead(body: dict[str, Any] = Body(...)):
    return _rules.create_lead(body)


@router.put("/leads/{lead_id}")
async def update_lead(lead_id: str, body: dict[str, Any] = Body(...)):
    return _rules.update_lead_record(lead_id, body)


@router.post("/leads/import/sheets")
async def import_leads_from_sheets(body: dict[str, Any] = Body(...)):
    return _rules.import_leads_from_sheets(
        spreadsheet_id=body.get("spreadsheetId", ""),
        sheet=body.get("sheet", "Hoja 1"),
        max_rows=int(body.get("maxRows", 100)),
    )


@router.get("/actions")
async def get_actions(status: str | None = None):
    return {"actions": _rules.list_actions_enriched(status=status)}


@router.post("/actions")
async def create_action(body: dict[str, Any] = Body(...)):
    return _rules.create_action(body)


@router.delete("/actions/{action_id}")
async def delete_action(action_id: str):
    return _rules.delete_action(action_id)


@router.get("/audit")
async def get_audit():
    return {"events": _state.list_audit_events()}


@router.post("/actions/{action_id}/approve")
async def approve_action(action_id: str):
    return _rules.approve_action(action_id)


@router.post("/actions/{action_id}/reject")
async def reject_action(action_id: str):
    return _rules.reject_action(action_id)


@router.post("/actions/{action_id}/execute")
async def execute_action(action_id: str):
    return _rules.execute_action(action_id)


@router.post("/signals")
async def create_signal(body: dict[str, Any] = Body(...)):
    return _rules.create_signal(body)


@router.post("/signals/{signal_id}/resolve")
async def resolve_signal(signal_id: str):
    return _rules.resolve_signal_record(signal_id)


@router.post("/workflows/{workflow_id}/run")
async def run_workflow(workflow_id: str):
    return _rules.run_workflow(workflow_id)


@router.get("/bridge/status")
async def get_bridge_status():
    return _rules.get_bridge_status()


@router.post("/bridge/mode")
async def set_bridge_mode(body: dict[str, Any] = Body(...)):
    return _rules.set_bridge_mode(body.get("mode", "local-demo"))


@router.get("/stats")
async def get_stats():
    return _state.get_dashboard_stats()


@router.get("/business-context")
async def get_business_context():
    return _state.get_business_context()


@router.post("/business-context")
async def save_business_context(body: dict[str, Any] = Body(...)):
    return {"success": True, "context": _state.save_business_context(body)}


@router.get("/automations")
async def get_automations():
    return _modules["automations"].list_automations()
