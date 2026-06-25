"""FastAPI routes for the HBO Plugin dashboard extension.

Mounted at /api/plugins/hbo-plugin/ by Hermes (see hermes_cli/web_server.py).

Note: Hermes loads this file via importlib as a standalone module — not as part
of the plugin package — so imports must resolve from the plugin root explicitly.
"""

from __future__ import annotations

import importlib.util
import sys
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


def _load_plugin_module(module_name: str, filename: str):
    """Load state.py / business_rules.py from the plugin root."""
    cache_key = f"hbo_plugin_{module_name}"
    if cache_key in sys.modules:
        return sys.modules[cache_key]
    path = _PLUGIN_ROOT / filename
    spec = importlib.util.spec_from_file_location(cache_key, path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Cannot load {path}")
    mod = importlib.util.module_from_spec(spec)
    sys.modules[cache_key] = mod
    spec.loader.exec_module(mod)
    return mod


_state = _load_plugin_module("state", "state.py")
_rules = _load_plugin_module("business_rules", "business_rules.py")


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
