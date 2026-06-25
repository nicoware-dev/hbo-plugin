"""JSON schemas and tool schema definitions for HBO Plugin tools."""

from __future__ import annotations

from typing import Any

ACTION_STATUS = ("pending", "approved", "rejected", "executed", "failed")
WORKFLOWS = ("inbound_sales", "outbound_growth", "daily_ops_briefing")
LEAD_PRIORITY = ("low", "medium", "high")
LEAD_STATUS = ("new", "needs_followup", "hot")
ACTION_RISK = ("low", "medium", "high")
SIGNAL_TYPES = ("missed_followup", "bot_qa", "custom")
AGENT_IDS = ("sales-ops-agent", "growth-agent", "ops-lead-agent")
SCORE_MIN = 0
SCORE_MAX = 100


def parse_score(value: Any, default: int = 50) -> int | None:
    """Return clamped score 0–100, or None if value is not a valid number."""
    if value is None or value == "":
        return default
    try:
        score = int(float(value))
    except (TypeError, ValueError):
        return None
    if score < SCORE_MIN or score > SCORE_MAX:
        return None
    return score
