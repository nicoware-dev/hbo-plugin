"""Gmail send via Composio CLI."""

from __future__ import annotations

from typing import Any

from .composio_client import is_available, run_argv


def send_email(recipient_email: str, subject: str, body: str) -> dict[str, Any]:
    """Send an email through Composio GMAIL_SEND_EMAIL."""
    if not recipient_email.strip():
        return {"success": False, "error": "recipient_email is required"}
    if not is_available():
        return {"success": False, "error": "Composio CLI not available"}

    payload = {
        "recipient_email": recipient_email,
        "subject": subject,
        "body": body,
    }
    try:
        data = run_argv(["execute", "GMAIL_SEND_EMAIL"], payload)
        return {"success": True, "tool": "GMAIL_SEND_EMAIL", "data": data}
    except Exception as exc:
        return {"success": False, "error": str(exc), "tool": "GMAIL_SEND_EMAIL"}
