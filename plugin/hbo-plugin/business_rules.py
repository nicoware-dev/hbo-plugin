"""Business rules — workflows, approvals, briefings, signal detection."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from . import schemas, state, workflows

_RUNNERS = {
    "inbound_sales": workflows.run_inbound_sales,
    "outbound_growth": workflows.run_outbound_growth,
    "daily_ops_briefing": workflows.run_daily_ops_briefing,
}


def detect_signals() -> list[dict[str, Any]]:
    return state.list_signals()


def run_workflow(workflow_id: str) -> dict[str, Any]:
    if workflow_id not in schemas.WORKFLOWS:
        return {"success": False, "error": f"Unknown workflow: {workflow_id}"}

    outputs = _RUNNERS[workflow_id]()
    run_record = state.record_workflow_run(workflow_id, outputs)
    event = state.append_audit_event(
        {
            "id": f"audit_{uuid4().hex[:8]}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "agentId": _owner_for_workflow(workflow_id),
            "eventType": "workflow_run",
            "summary": _summary_for_workflow(workflow_id, outputs),
            "workflowId": workflow_id,
        }
    )
    return {
        "success": True,
        "workflow": workflow_id,
        "outputs": outputs,
        "lastRunAt": run_record["ranAt"],
        "auditEventId": event["id"],
    }


def _owner_for_workflow(workflow_id: str) -> str:
    owners = {
        "inbound_sales": "sales-ops-agent",
        "outbound_growth": "growth-agent",
        "daily_ops_briefing": "ops-lead-agent",
    }
    return owners.get(workflow_id, "ops-lead-agent")


def _summary_for_workflow(workflow_id: str, outputs: dict[str, Any]) -> str:
    if workflow_id == "inbound_sales":
        n_sig = len(outputs.get("signals", []))
        n_act = len(outputs.get("actionProposals", []))
        return f"Ran inbound sales — {n_sig} signals, {n_act} action proposals."
    if workflow_id == "outbound_growth":
        batch = outputs.get("outreachBatch", {})
        return f"Ran outbound growth — outreach batch of {batch.get('leadCount', 0)} leads."
    briefing = outputs.get("briefing", {})
    return f"Ran daily ops briefing — {briefing.get('title', 'briefing')} generated."


def approve_action(action_id: str) -> dict[str, Any]:
    from . import execution

    action = next((a for a in state.list_actions() if a.get("id") == action_id), None)
    if not action:
        return {"success": False, "error": f"Action not found: {action_id}"}
    if action.get("status") != "pending":
        return {"success": False, "error": f"Action is not pending: {action.get('status')}"}

    updated = state.update_action(action_id, "approved")
    if not updated:
        return {"success": False, "error": f"Action not found: {action_id}"}
    event = state.append_audit_event(
        {
            "id": f"audit_{uuid4().hex[:8]}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "agentId": updated.get("agentId", "ops-lead-agent"),
            "eventType": "action_approved",
            "summary": f"User approved action {action_id}: {updated.get('title', '')}.",
            "actionId": action_id,
        }
    )
    result: dict[str, Any] = {"success": True, "action": updated, "auditEvent": event}

    if execution.should_execute(updated):
        exec_result = execution.execute_approved_action(updated)
        result["execution"] = exec_result
        final_status = "executed" if exec_result.get("success") else "failed"
        updated = state.update_action(action_id, final_status) or updated
        result["action"] = updated
        state.append_audit_event(
            {
                "id": f"audit_{uuid4().hex[:8]}",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "agentId": updated.get("agentId", "ops-lead-agent"),
                "eventType": "action_executed" if exec_result.get("success") else "action_failed",
                "summary": (
                    f"Composio executed {action_id}: {exec_result.get('tool', 'email')}."
                    if exec_result.get("success")
                    else f"Composio execution failed for {action_id}: {exec_result.get('error', 'unknown')}."
                ),
                "actionId": action_id,
            }
        )
    return result


def reject_action(action_id: str) -> dict[str, Any]:
    updated = state.update_action(action_id, "rejected")
    if not updated:
        return {"success": False, "error": f"Action not found: {action_id}"}
    event = state.append_audit_event(
        {
            "id": f"audit_{uuid4().hex[:8]}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "agentId": updated.get("agentId", "ops-lead-agent"),
            "eventType": "action_rejected",
            "summary": f"User rejected action {action_id}: {updated.get('title', '')}.",
            "actionId": action_id,
        }
    )
    return {"success": True, "action": updated, "auditEvent": event}


def generate_briefing() -> dict[str, Any]:
    briefing = workflows.build_briefing_payload()
    state.append_briefing(briefing)
    return {"success": True, "briefing": briefing}


from .mutations import (  # noqa: E402
    create_action,
    create_lead,
    create_signal,
    delete_action,
    import_leads_from_sheets,
    resolve_signal_record,
    update_lead_record,
)


def get_bridge_status() -> dict[str, Any]:
    from .sources import bridge

    return bridge.get_status()


def set_bridge_mode(mode: str) -> dict[str, Any]:
    from .sources import bridge

    return bridge.set_mode(mode)


def send_approval_email(
    action_id: str = "",
    recipient_email: str = "",
    subject: str = "",
    body: str = "",
) -> dict[str, Any]:
    from . import execution

    return execution.send_approval_email(
        action_id=action_id or None,
        recipient_email=recipient_email or None,
        subject=subject or None,
        body=body or None,
    )
