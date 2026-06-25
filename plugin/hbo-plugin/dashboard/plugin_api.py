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

try:
    from fastapi import APIRouter
except Exception:  # pragma: no cover - allows import without FastAPI in dev
    class APIRouter:  # type: ignore[no-redef]
        def get(self, *_args, **_kwargs):
            return lambda fn: fn

        def post(self, *_args, **_kwargs):
            return lambda fn: fn

router = APIRouter()

_PLUGIN_ROOT = Path(__file__).resolve().parent.parent
_PACKAGE = "hbo_plugin"


def _load_plugin_modules():
    """Load plugin modules when Hermes imports this file standalone."""
    if _PACKAGE not in sys.modules:
        sys.modules[_PACKAGE] = types.ModuleType(_PACKAGE)

    loaded: dict[str, object] = {}
    for name, filename in (
        ("schemas", "schemas.py"),
        ("state", "state.py"),
        ("workflows", "workflows.py"),
        ("business_rules", "business_rules.py"),
    ):
        full_name = f"{_PACKAGE}.{name}"
        if full_name in sys.modules:
            loaded[name] = sys.modules[full_name]
            continue
        path = _PLUGIN_ROOT / filename
        spec = importlib.util.spec_from_file_location(full_name, path)
        if spec is None or spec.loader is None:
            raise ImportError(f"Cannot load {path}")
        mod = importlib.util.module_from_spec(spec)
        mod.__package__ = _PACKAGE
        sys.modules[full_name] = mod
        spec.loader.exec_module(mod)
        loaded[name] = mod
    return loaded


_modules = _load_plugin_modules()
_state = _modules["state"]
_rules = _modules["business_rules"]


@router.get("/workflows")
async def get_workflows():
    return {"workflows": _state.list_workflows()}


@router.get("/signals")
async def get_signals():
    return {"signals": _state.list_signals()}


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


@router.get("/actions")
async def get_actions(status: str | None = None):
    return {"actions": _state.list_actions(status=status)}


@router.get("/audit")
async def get_audit():
    return {"events": _state.list_audit_events()}


@router.post("/actions/{action_id}/approve")
async def approve_action(action_id: str):
    return _rules.approve_action(action_id)


@router.post("/actions/{action_id}/reject")
async def reject_action(action_id: str):
    return _rules.reject_action(action_id)


@router.post("/workflows/{workflow_id}/run")
async def run_workflow(workflow_id: str):
    return _rules.run_workflow(workflow_id)
