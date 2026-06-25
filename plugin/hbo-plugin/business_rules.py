"""Business rules — workflows, approvals, briefings, signal detection."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from . import schemas, state


def detect_signals() -> list[dict[str, Any]]:
    return state.read_json("signals.json", [])


def run_workflow(workflow_id: str) -> dict[str, Any]:
    if workflow_id not in schemas.WORKFLOWS:
        return {"success": False, "error": f"Unknown workflow: {workflow_id}"}

    event = {
        "id": f"audit_{uuid4().hex[:8]}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "agentId": _owner_for_workflow(workflow_id),
        "eventType": "workflow_run",
        "summary": f"Ran workflow {workflow_id}",
    }
    state.append_audit_event(event)
    return {"success": True, "workflow": workflow_id, "auditEventId": event["id"]}


def _owner_for_workflow(workflow_id: str) -> str:
    owners = {
        "inbound_sales": "sales-ops-agent",
        "outbound_growth": "growth-agent",
        "daily_ops_briefing": "ops-lead-agent",
    }
    return owners.get(workflow_id, "ops-lead-agent")


def approve_action(action_id: str) -> dict[str, Any]:
    updated = state.update_action(action_id, "approved")
    if not updated:
        return {"success": False, "error": f"Action not found: {action_id}"}
    event = state.append_audit_event({
        "id": f"audit_{uuid4().hex[:8]}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "agentId": updated.get("agentId", "ops-lead-agent"),
        "eventType": "action_approved",
        "summary": f"User approved action {action_id}.",
        "actionId": action_id,
    })
    return {"success": True, "action": updated, "auditEvent": event}


def reject_action(action_id: str) -> dict[str, Any]:
    updated = state.update_action(action_id, "rejected")
    if not updated:
        return {"success": False, "error": f"Action not found: {action_id}"}
    event = state.append_audit_event({
        "id": f"audit_{uuid4().hex[:8]}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "agentId": updated.get("agentId", "ops-lead-agent"),
        "eventType": "action_rejected",
        "summary": f"User rejected action {action_id}.",
        "actionId": action_id,
    })
    return {"success": True, "action": updated, "auditEvent": event}


def generate_briefing() -> dict[str, Any]:
    summary = state.get_workspace_summary()
    briefing = {
        "id": f"brief_{uuid4().hex[:8]}",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "title": "Daily Ops Briefing",
        "priorities": [
            f"{summary['pendingActions']} actions awaiting approval",
            f"{summary['openSignals']} open signals need review",
        ],
        "pendingApprovals": summary["pendingActions"],
    }
    state.append_briefing(briefing)
    return {"success": True, "briefing": briefing}
