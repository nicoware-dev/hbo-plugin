"""Scheduled source sync — Sheets import with audit events."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from .. import state
from . import bridge, sheets


def _sheet_config(spreadsheet_id: str, sheet: str) -> tuple[str, str]:
    sources = state.get_demo_sources()
    sid = spreadsheet_id or sources.get("googleSheetsSpreadsheetId", "")
    sheet_name = sheet or sources.get("defaultSheetName", "Hoja 1")
    return sid, sheet_name


def sync_sales_sources(
    spreadsheet_id: str = "",
    sheet: str = "Hoja 1",
    max_rows: int = 100,
) -> dict[str, Any]:
    """Import leads from Google Sheets when bridge allows; always writes audit."""
    mode = state.get_workspace_config().get("selectedBridge", "local-demo")
    sid, sheet_name = _sheet_config(spreadsheet_id, sheet)

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

    if not sid:
        event = state.append_audit_event(
            {
                "id": f"audit_{uuid4().hex[:8]}",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "agentId": "sales-ops-agent",
                "eventType": "source_sync",
                "summary": "Sales source sync skipped — no spreadsheet ID configured.",
            }
        )
        return {
            "success": True,
            "skipped": True,
            "imported": 0,
            "message": "Set demoSources.googleSheetsSpreadsheetId in workspace or pass spreadsheetId.",
            "auditEvent": event,
        }

    result = sheets.import_leads(spreadsheet_id=sid, sheet=sheet_name, max_rows=max_rows)
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
