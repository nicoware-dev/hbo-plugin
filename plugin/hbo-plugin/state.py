"""File-backed JSON state for the Business Ops Demo."""

from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
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
    last_briefing = briefings[-1] if briefings else None
    return {
        "workspaceName": ws.get("name", "Business Ops Demo"),
        "status": ws.get("status", "ready"),
        "selectedBridge": ws.get("selectedBridge", "local-demo"),
        "activeAgents": len(read_json("agents.json", [])),
        "openSignals": len(list_signals(open_only=True)),
        "pendingActions": pending,
        "lastBriefingAt": last_briefing.get("generatedAt") if last_briefing else None,
        "lastBriefingTitle": last_briefing.get("title") if last_briefing else None,
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


def get_business_context() -> dict[str, Any]:
    default = {
        "businessName": "",
        "description": "",
        "products": "",
        "targetAudience": "",
        "toneOfVoice": "",
        "competitors": "",
        "uniqueSellingPoints": "",
        "customInstructions": "",
    }
    stored = read_json("business-context.json", default)
    return {**default, **stored}


def save_business_context(data: dict[str, Any]) -> dict[str, Any]:
    ctx = get_business_context()
    allowed = set(ctx.keys())
    for key, value in data.items():
        if key in allowed:
            ctx[key] = str(value).strip()
    ctx["updatedAt"] = datetime.now(timezone.utc).isoformat()
    write_json("business-context.json", ctx)
    return ctx


def format_business_context_prompt() -> str:
    """Single block for SOUL / agent system prompt injection."""
    ctx = get_business_context()
    if not ctx.get("businessName"):
        return ""
    lines = [
        f"Business: {ctx['businessName']}",
        f"Description: {ctx['description']}",
        f"Products: {ctx['products']}",
        f"Audience: {ctx['targetAudience']}",
        f"Tone: {ctx['toneOfVoice']}",
        f"USPs: {ctx['uniqueSellingPoints']}",
    ]
    if ctx.get("competitors"):
        lines.append(f"Competitors: {ctx['competitors']}")
    if ctx.get("customInstructions"):
        lines.append(f"Instructions: {ctx['customInstructions']}")
    return "\n".join(lines)


def get_dashboard_stats() -> dict[str, Any]:
    leads = list_leads()
    funnel: dict[str, int] = {"new": 0, "needs_followup": 0, "hot": 0, "converted": 0}
    segments: dict[str, int] = {}
    score_bins = {"0-50": 0, "51-70": 0, "71-85": 0, "86-100": 0}
    priorities: dict[str, int] = {"low": 0, "medium": 0, "high": 0}

    for lead in leads:
        status = lead.get("status", "new")
        funnel[status] = funnel.get(status, 0) + 1
        seg = lead.get("segment") or "other"
        segments[seg] = segments.get(seg, 0) + 1
        try:
            score = int(lead.get("score", 0))
        except (TypeError, ValueError):
            score = 0
        if score <= 50:
            score_bins["0-50"] += 1
        elif score <= 70:
            score_bins["51-70"] += 1
        elif score <= 85:
            score_bins["71-85"] += 1
        else:
            score_bins["86-100"] += 1
        pri = lead.get("priority", "medium")
        priorities[pri] = priorities.get(pri, 0) + 1

    agent_workload: dict[str, int] = {}
    for action in list_actions(status="pending"):
        aid = action.get("agentId", "unknown")
        agent_workload[aid] = agent_workload.get(aid, 0) + 1

    signal_types: dict[str, int] = {}
    for signal in list_signals(open_only=True):
        st = signal.get("type", "custom")
        signal_types[st] = signal_types.get(st, 0) + 1

    audit_timeline = _audit_timeline(days=7)

    return {
        "funnel": funnel,
        "segments": segments,
        "scoreBins": score_bins,
        "priorities": priorities,
        "agentWorkload": agent_workload,
        "signalTypes": signal_types,
        "auditTimeline": audit_timeline,
        "totalLeads": len(leads),
    }


def _audit_timeline(days: int = 7) -> dict[str, int]:
    today = datetime.now(timezone.utc).date()
    buckets: dict[str, int] = {}
    for i in range(days):
        day = today - timedelta(days=days - 1 - i)
        buckets[day.isoformat()] = 0
    for event in list_audit_events():
        ts = str(event.get("timestamp", ""))[:10]
        if ts in buckets:
            buckets[ts] += 1
    return buckets
