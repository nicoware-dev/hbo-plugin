"""File-backed JSON state for the Business Ops Demo."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

PLUGIN_DIR = Path(__file__).parent
DATA_DIR = PLUGIN_DIR / "data" / "business-ops-demo"
ORIGINAL_DIR = PLUGIN_DIR / "data" / "business-ops-demo-original"


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
        "selectedBridge": ws.get("selectedBridge", "local-demo"),
        "activeAgents": len(read_json("agents.json", [])),
        "openSignals": len(list_signals(open_only=True)),
        "pendingActions": pending,
        "lastBriefingAt": last,
    }


def get_workspace_config() -> dict[str, Any]:
    return read_json("workspace.json", {})


def set_selected_bridge(mode: str) -> dict[str, Any]:
    ws = read_json("workspace.json", {})
    ws["selectedBridge"] = mode
    write_json("workspace.json", ws)
    return ws


def list_agents() -> list[dict[str, Any]]:
    return read_json("agents.json", [])


_WORKFLOW_DEFS = [
    {"id": "inbound_sales", "name": "Inbound Sales", "ownerAgentId": "sales-ops-agent"},
    {"id": "outbound_growth", "name": "Outbound Growth", "ownerAgentId": "growth-agent"},
    {"id": "daily_ops_briefing", "name": "Daily Ops Briefing", "ownerAgentId": "ops-lead-agent"},
]


def list_workflows() -> list[dict[str, Any]]:
    runs = read_json("workflow_runs.json", {})
    workflows: list[dict[str, Any]] = []
    for wf in _WORKFLOW_DEFS:
        run = runs.get(wf["id"], {})
        workflows.append(
            {
                **wf,
                "lastRunAt": run.get("ranAt"),
                "status": run.get("status", "idle"),
                "lastOutputs": run.get("outputs"),
            }
        )
    return workflows


def record_workflow_run(workflow_id: str, outputs: dict[str, Any]) -> dict[str, Any]:
    runs = read_json("workflow_runs.json", {})
    record = {
        "workflowId": workflow_id,
        "ranAt": datetime.now(timezone.utc).isoformat(),
        "status": "completed",
        "outputs": outputs,
    }
    runs[workflow_id] = record
    write_json("workflow_runs.json", runs)
    return record


def list_leads() -> list[dict[str, Any]]:
    return read_json("leads.json", [])


def append_lead(lead: dict[str, Any]) -> dict[str, Any]:
    leads = read_json("leads.json", [])
    leads.append(lead)
    write_json("leads.json", leads)
    return lead


def update_lead(lead_id: str, data: dict[str, Any]) -> dict[str, Any] | None:
    leads = read_json("leads.json", [])
    for lead in leads:
        if lead.get("id") == lead_id:
            lead.update(data)
            lead["updatedAt"] = datetime.now(timezone.utc).isoformat()
            write_json("leads.json", leads)
            return lead
    return None


def list_signals(*, open_only: bool = False) -> list[dict[str, Any]]:
    signals = read_json("signals.json", [])
    if not open_only:
        return signals
    return [s for s in signals if s.get("status", "open") != "resolved"]


def list_conversations() -> list[dict[str, Any]]:
    return read_json("conversations.json", [])


def append_signal(signal: dict[str, Any]) -> dict[str, Any]:
    signals = read_json("signals.json", [])
    signal.setdefault("status", "open")
    signals.append(signal)
    write_json("signals.json", signals)
    return signal


def resolve_signal(signal_id: str) -> dict[str, Any] | None:
    signals = read_json("signals.json", [])
    for signal in signals:
        if signal.get("id") == signal_id:
            signal["status"] = "resolved"
            signal["resolvedAt"] = datetime.now(timezone.utc).isoformat()
            write_json("signals.json", signals)
            return signal
    return None


def append_action(action: dict[str, Any]) -> dict[str, Any]:
    actions = read_json("actions.json", [])
    actions.append(action)
    write_json("actions.json", actions)
    return action


def list_actions(*, status: str | None = None) -> list[dict[str, Any]]:
    actions = read_json("actions.json", [])
    if status:
        return [a for a in actions if a.get("status") == status]
    return actions


def list_audit_events() -> list[dict[str, Any]]:
    return read_json("audit.json", [])


def remove_action(action_id: str) -> dict[str, Any] | None:
    actions = read_json("actions.json", [])
    for i, action in enumerate(actions):
        if action.get("id") == action_id:
            removed = actions.pop(i)
            write_json("actions.json", actions)
            return removed
    return None


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


def reset_demo_data() -> None:
    for path in ORIGINAL_DIR.glob("*.json"):
        write_json(path.name, json.loads(path.read_text(encoding="utf-8")))
    write_json("workflow_runs.json", {})


def load_demo_data() -> dict[str, Any]:
    reset_demo_data()
    return {
        "success": True,
        "workspace": get_workspace_summary(),
        "message": "Demo data reset from bundled files.",
    }
