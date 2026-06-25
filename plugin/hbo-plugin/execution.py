"""Post-approval execution via Composio (Gmail, etc.)."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from . import state
from .sources import bridge, gmail

EXECUTABLE_TYPES = ("send_email", "mock_approved_spend_request")


def should_execute(action: dict[str, Any]) -> bool:
    if action.get("actionType") == "mock_approved_spend_request":
        return True
    mode = state.get_workspace_config().get("selectedBridge", "local-demo")
    if mode not in ("composio", "hybrid"):
        return False
    if action.get("actionType") in EXECUTABLE_TYPES:
        return True
    if action.get("composioTool"):
        return True
    if action.get("title", "").lower().find("follow-up") >= 0:
        return _lead_has_email(action.get("source", ""))
    return False


def execute_approved_action(action: dict[str, Any]) -> dict[str, Any]:
    if action.get("actionType") == "mock_approved_spend_request":
        return _mock_stripe_spend(action)
    if action.get("actionType") == "send_email" or action.get("composioTool") == "GMAIL_SEND_EMAIL":
        return _send_email_for_action(action)
    if "follow-up" in action.get("title", "").lower():
        return _send_email_for_action(action)
    tool = action.get("composioTool")
    if tool:
        return {"success": False, "error": f"Unsupported composio tool: {tool}"}
    return {"success": False, "error": "No execution handler for this action"}


def send_approval_email(
    *,
    action_id: str | None = None,
    recipient_email: str | None = None,
    subject: str | None = None,
    body: str | None = None,
) -> dict[str, Any]:
    if action_id:
        action = next((a for a in state.list_actions() if a.get("id") == action_id), None)
        if not action:
            return {"success": False, "error": f"Action not found: {action_id}"}
        if action.get("status") not in ("approved", "pending"):
            return {"success": False, "error": f"Action status must be approved or pending, got {action.get('status')}"}
        payload = _email_payload_from_action(action)
        if recipient_email:
            payload["recipient_email"] = recipient_email
        if subject:
            payload["subject"] = subject
        if body:
            payload["body"] = body
    else:
        if not recipient_email:
            return {"success": False, "error": "recipientEmail or actionId is required"}
        payload = {
            "recipient_email": recipient_email,
            "subject": subject or "Business Ops follow-up",
            "body": body or "Following up on your recent inquiry.",
        }

    result = gmail.send_email(payload["recipient_email"], payload["subject"], payload["body"])
    if result.get("success"):
        event = state.append_audit_event(
            {
                "id": f"audit_{uuid4().hex[:8]}",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "agentId": "ops-lead-agent",
                "eventType": "email_sent",
                "summary": f"Sent email to {payload['recipient_email']}: {payload['subject']}.",
                "actionId": action_id,
            }
        )
        result["auditEvent"] = event
    return result


def _send_email_for_action(action: dict[str, Any]) -> dict[str, Any]:
    payload = _email_payload_from_action(action)
    if not payload.get("recipient_email"):
        return {"success": False, "error": "No recipient email found for action"}
    return gmail.send_email(payload["recipient_email"], payload["subject"], payload["body"])


def _email_payload_from_action(action: dict[str, Any]) -> dict[str, str]:
    composio_payload = action.get("composioPayload") or {}
    lead = _lead_for_action(action)
    recipient = composio_payload.get("recipient_email") or (lead or {}).get("email", "")
    subject = composio_payload.get("subject") or f"Follow-up: {action.get('title', 'Business Ops')}"
    body = composio_payload.get("body") or action.get("description") or "Following up on your recent inquiry."
    if lead and lead.get("name") and lead["name"] not in body:
        body = f"Hi {lead['name']},\n\n{body}"
    return {"recipient_email": recipient, "subject": subject, "body": body}


def _lead_for_action(action: dict[str, Any]) -> dict[str, Any] | None:
    source = action.get("source", "")
    if not source.startswith("lead"):
        return None
    return next((l for l in state.list_leads() if l.get("id") == source), None)


def _lead_has_email(lead_id: str) -> bool:
    lead = next((l for l in state.list_leads() if l.get("id") == lead_id), None)
    return bool(lead and lead.get("email"))


def _mock_stripe_spend(action: dict[str, Any]) -> dict[str, Any]:
    amount = action.get("spendAmount", "49.00")
    currency = action.get("spendCurrency", "usd")
    purpose = action.get("title", "Approved purchase")
    cmd = (
        f'stripe link spend create --amount {amount} --currency {currency} '
        f'--description "{purpose}"'
    )
    event = state.append_audit_event(
        {
            "id": f"audit_{uuid4().hex[:8]}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "agentId": action.get("agentId", "ops-lead-agent"),
            "eventType": "mock_stripe_spend",
            "summary": f"Stripe Link CLI spend request would be created: {purpose} ({amount} {currency}).",
            "actionId": action.get("id"),
        }
    )
    return {
        "success": True,
        "mock": True,
        "tool": "stripe-link-cli",
        "command": cmd,
        "message": "Mock mode — no real payment credentials used.",
        "auditEvent": event,
    }
