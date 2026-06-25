"""Tool bridge status — local demo + Composio CLI."""

from __future__ import annotations

from typing import Any

from .. import state
from .composio_client import is_available, platform, run

BRIDGE_MODES = ("local-demo", "composio", "hybrid")


def get_status() -> dict[str, Any]:
    ws = state.get_workspace_config()
    mode = ws.get("selectedBridge", "local-demo")
    composio: dict[str, Any] = {
        "available": is_available(),
        "platform": platform(),
        "loggedIn": False,
    }
    if is_available():
        try:
            data = run("whoami")
            composio["loggedIn"] = True
            composio["user"] = (
                data.get("email")
                or data.get("user_id")
                or data.get("userId")
                or data.get("current_org_name")
            )
            composio["raw"] = data
        except Exception as exc:
            composio["error"] = _short_error(str(exc))

    return {
        "mode": mode,
        "bridges": [
            {"name": "Local demo data", "id": "local-demo", "status": "active"},
            {
                "name": "Composio CLI",
                "id": "composio",
                "status": _composio_status(composio),
                "platform": composio.get("platform"),
                "user": composio.get("user"),
                "error": composio.get("error"),
            },
            {"name": "WithOne / One CLI", "id": "withone", "status": "future"},
            {"name": "n8n", "id": "n8n", "status": "future"},
        ],
        "composio": composio,
        "expiredConnectionsNote": "Re-link expired toolkits: composio link whatsapp && composio link googlemeet",
    }


def _composio_status(composio: dict[str, Any]) -> str:
    if not composio.get("available"):
        return "unavailable"
    if composio.get("loggedIn"):
        return "connected"
    if composio.get("error"):
        return "error"
    return "available"


def set_mode(mode: str) -> dict[str, Any]:
    if mode not in BRIDGE_MODES:
        return {"success": False, "error": f"Invalid mode: {mode}. Use: {', '.join(BRIDGE_MODES)}"}
    ws = state.set_selected_bridge(mode)
    return {"success": True, "mode": ws.get("selectedBridge", mode)}


def _short_error(message: str, limit: int = 240) -> str:
    text = " ".join(message.split())
    if len(text) <= limit:
        return text
    return text[: limit - 3] + "..."
