"""File-backed JSON state for the Business Ops Demo."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

PLUGIN_DIR = Path(__file__).parent
DATA_DIR = PLUGIN_DIR / "data" / "business-ops-demo"


def read_json(name: str, default: Any) -> Any:
    path = DATA_DIR / name
    if not path.exists():
        return default
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def write_json(name: str, data: Any) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with (DATA_DIR / name).open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, default=str)


def get_workspace_summary() -> dict[str, Any]:
    ws = read_json("workspace.json", {})
    actions = read_json("actions.json", [])
    pending = sum(1 for a in actions if a.get("status") == "pending")
    briefings = read_json("briefings.json", [])
    last = briefings[-1]["generatedAt"] if briefings else None
    return {
        "workspaceName": ws.get("name", "Business Ops Demo"),
        "status": ws.get("status", "ready"),
        "activeAgents": len(read_json("agents.json", [])),
        "openSignals": len(read_json("signals.json", [])),
        "pendingActions": pending,
        "lastBriefingAt": last,
    }


def list_agents() -> list[dict[str, Any]]:
    return read_json("agents.json", [])


def list_workflows() -> list[dict[str, Any]]:
    return [
        {"id": "inbound_sales", "name": "Inbound Sales", "ownerAgentId": "sales-ops-agent"},
        {"id": "outbound_growth", "name": "Outbound Growth", "ownerAgentId": "growth-agent"},
        {"id": "daily_ops_briefing", "name": "Daily Ops Briefing", "ownerAgentId": "ops-lead-agent"},
    ]


def list_leads() -> list[dict[str, Any]]:
    return read_json("leads.json", [])


def list_actions(*, status: str | None = None) -> list[dict[str, Any]]:
    actions = read_json("actions.json", [])
    if status:
        return [a for a in actions if a.get("status") == status]
    return actions


def list_audit_events() -> list[dict[str, Any]]:
    return read_json("audit.json", [])


def update_action(action_id: str, status: str) -> dict[str, Any] | None:
    actions = read_json("actions.json", [])
    for action in actions:
        if action.get("id") == action_id:
            action["status"] = status
            action["updatedAt"] = datetime.now(timezone.utc).isoformat()
            write_json("actions.json", actions)
            return action
    return None


def append_audit_event(event: dict[str, Any]) -> dict[str, Any]:
    events = read_json("audit.json", [])
    events.append(event)
    write_json("audit.json", events)
    return event


def append_briefing(briefing: dict[str, Any]) -> dict[str, Any]:
    briefings = read_json("briefings.json", [])
    briefings.append(briefing)
    write_json("briefings.json", briefings)
    return briefing


def load_demo_data() -> dict[str, Any]:
    return {
        "success": True,
        "workspace": get_workspace_summary(),
        "message": "Demo data loaded from bundled files.",
    }
