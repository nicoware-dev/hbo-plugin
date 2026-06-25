"""Scheduled source sync — Sheets import with audit events."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from .. import state
from . import bridge, sheets

DEFAULT_SPREADSHEET_ID = "1fXOFKrbU7w9b8TbXfhZsNYnyxg0jOKlaMQ-g3z5OA1g"


def sync_sales_sources(
    spreadsheet_id: str = "",
    sheet: str = "Hoja 1",
    max_rows: int = 100,
) -> dict[str, Any]:
    """Import leads from Google Sheets when bridge allows; always writes audit."""
    mode = state.get_workspace_config().get("selectedBridge", "local-demo")
    sid = spreadsheet_id or DEFAULT_SPREADSHEET_ID

    if mode == "local-demo" and not bridge.is_available():
        event = state.append_audit_event(
            {
                "id": f"audit_{uuid4().hex[:8]}",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "agentId": "sales-ops-agent",
                "eventType": "source_sync",
                "summary": "Sales source sync skipped — local-demo mode without Composio.",
            }
        )
        return {
            "success": True,
            "skipped": True,
            "imported": 0,
            "message": "Set bridge to composio or hybrid to import from Sheets.",
            "auditEvent": event,
        }

    result = sheets.import_leads(spreadsheet_id=sid, sheet=sheet, max_rows=max_rows)
    imported = result.get("imported", 0)
    summary = (
        f"Sales source sync: imported {imported} leads from Google Sheets."
        if result.get("success")
        else f"Sales source sync failed: {result.get('error', 'unknown')}"
    )
    event = state.append_audit_event(
        {
            "id": f"audit_{uuid4().hex[:8]}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "agentId": "sales-ops-agent",
            "eventType": "source_sync",
            "summary": summary,
        }
    )
    return {**result, "auditEvent": event}
