"""CRUD mutations with validation and audit events."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from . import schemas, state


def _audit(agent_id: str, event_type: str, summary: str, **extra: Any) -> dict[str, Any]:
    return state.append_audit_event(
        {
            "id": f"audit_{uuid4().hex[:8]}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "agentId": agent_id,
            "eventType": event_type,
            "summary": summary,
            **extra,
        }
    )


def _require_enum(value: str, allowed: tuple[str, ...], field: str) -> str | None:
    if value not in allowed:
        return f"Invalid {field}: {value}. Allowed: {', '.join(allowed)}"
    return None


def create_lead(data: dict[str, Any]) -> dict[str, Any]:
    name = (data.get("name") or "").strip()
    if not name:
        return {"success": False, "error": "name is required"}
    for field, allowed in (
        ("priority", schemas.LEAD_PRIORITY),
        ("status", schemas.LEAD_STATUS),
    ):
        err = _require_enum(data.get(field, "medium" if field == "priority" else "new"), allowed, field)
        if err:
            return {"success": False, "error": err}
    owner = data.get("ownerAgentId", "sales-ops-agent")
    if owner not in schemas.AGENT_IDS:
        return {"success": False, "error": f"Invalid ownerAgentId: {owner}"}
    lead = {
        "id": f"lead_{uuid4().hex[:8]}",
        "name": name,
        "source": data.get("source", "dashboard"),
        "segment": data.get("segment", "commerce"),
        "score": int(data.get("score", 50)),
        "priority": data.get("priority", "medium"),
        "status": data.get("status", "new"),
        "ownerAgentId": owner,
        "recommendedAction": data.get("recommendedAction", "Review new lead"),
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    for optional in ("email", "company", "phone"):
        if data.get(optional):
            lead[optional] = data[optional]
    state.append_lead(lead)
    event = _audit(owner, "lead_created", f"Created lead {lead['id']}: {name}.", leadId=lead["id"])
    return {"success": True, "lead": lead, "auditEvent": event}


def update_lead_record(lead_id: str, data: dict[str, Any]) -> dict[str, Any]:
    payload = {k: v for k, v in data.items() if k != "id"}
    for field, allowed in (("priority", schemas.LEAD_PRIORITY), ("status", schemas.LEAD_STATUS)):
        if field in payload:
            err = _require_enum(str(payload[field]), allowed, field)
            if err:
                return {"success": False, "error": err}
    if "ownerAgentId" in payload and payload["ownerAgentId"] not in schemas.AGENT_IDS:
        return {"success": False, "error": f"Invalid ownerAgentId: {payload['ownerAgentId']}"}
    updated = state.update_lead(lead_id, payload)
    if not updated:
        return {"success": False, "error": f"Lead not found: {lead_id}"}
    event = _audit(
        updated.get("ownerAgentId", "sales-ops-agent"),
        "lead_updated",
        f"Updated lead {lead_id}: {updated.get('name', '')}.",
        leadId=lead_id,
    )
    return {"success": True, "lead": updated, "auditEvent": event}


def create_action(data: dict[str, Any]) -> dict[str, Any]:
    title = (data.get("title") or "").strip()
    if not title:
        return {"success": False, "error": "title is required"}
    risk = data.get("risk", "low")
    err = _require_enum(risk, schemas.ACTION_RISK, "risk")
    if err:
        return {"success": False, "error": err}
    agent_id = data.get("agentId", "ops-lead-agent")
    if agent_id not in schemas.AGENT_IDS:
        return {"success": False, "error": f"Invalid agentId: {agent_id}"}
    action = {
        "id": f"act_{uuid4().hex[:8]}",
        "title": title,
        "agentId": agent_id,
        "source": data.get("source", "dashboard"),
        "risk": risk,
        "status": "pending",
        "description": data.get("description", ""),
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    state.append_action(action)
    event = _audit(agent_id, "action_created", f"Created action {action['id']}: {title}.", actionId=action["id"])
    return {"success": True, "action": action, "auditEvent": event}


def delete_action(action_id: str) -> dict[str, Any]:
    existing = next((a for a in state.list_actions() if a.get("id") == action_id), None)
    if not existing:
        return {"success": False, "error": f"Action not found: {action_id}"}
    if existing.get("status") == "approved":
        return {"success": False, "error": "Cannot delete an approved action"}
    removed = state.remove_action(action_id)
    if not removed:
        return {"success": False, "error": f"Action not found: {action_id}"}
    event = _audit(
        removed.get("agentId", "ops-lead-agent"),
        "action_deleted",
        f"Deleted action {action_id}: {removed.get('title', '')}.",
        actionId=action_id,
    )
    return {"success": True, "action": removed, "auditEvent": event}


def create_signal(data: dict[str, Any]) -> dict[str, Any]:
    summary = (data.get("summary") or "").strip()
    if not summary:
        return {"success": False, "error": "summary is required"}
    sig_type = data.get("type", "custom")
    err = _require_enum(sig_type, schemas.SIGNAL_TYPES, "type")
    if err:
        return {"success": False, "error": err}
    owner = data.get("ownerAgentId", "sales-ops-agent")
    if owner not in schemas.AGENT_IDS:
        return {"success": False, "error": f"Invalid ownerAgentId: {owner}"}
    signal = {
        "id": f"sig_{uuid4().hex[:8]}",
        "type": sig_type,
        "summary": summary,
        "ownerAgentId": owner,
        "status": "open",
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    if data.get("leadId"):
        signal["leadId"] = data["leadId"]
    if data.get("conversationId"):
        signal["conversationId"] = data["conversationId"]
    state.append_signal(signal)
    event = _audit(owner, "signal_created", f"Created signal {signal['id']}: {summary}.", signalId=signal["id"])
    return {"success": True, "signal": signal, "auditEvent": event}


def resolve_signal_record(signal_id: str) -> dict[str, Any]:
    existing = next((s for s in state.list_signals() if s.get("id") == signal_id), None)
    if not existing:
        return {"success": False, "error": f"Signal not found: {signal_id}"}
    if existing.get("status") == "resolved":
        return {"success": False, "error": "Signal already resolved"}
    updated = state.resolve_signal(signal_id)
    if not updated:
        return {"success": False, "error": f"Signal not found: {signal_id}"}
    event = _audit(
        updated.get("ownerAgentId", "sales-ops-agent"),
        "signal_resolved",
        f"Resolved signal {signal_id}: {updated.get('summary', '')}.",
        signalId=signal_id,
    )
    return {"success": True, "signal": updated, "auditEvent": event}


def import_leads_from_sheets(
    spreadsheet_id: str,
    sheet: str = "Hoja 1",
    max_rows: int = 100,
) -> dict[str, Any]:
    from .sources import sheets

    return sheets.import_leads(spreadsheet_id, sheet=sheet, max_rows=max_rows)
