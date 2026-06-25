"""JSON schemas and tool schema definitions for HBO Plugin tools."""

from __future__ import annotations

ACTION_STATUS = ("pending", "approved", "rejected", "executed", "failed")
WORKFLOWS = ("inbound_sales", "outbound_growth", "daily_ops_briefing")
LEAD_PRIORITY = ("low", "medium", "high")
LEAD_STATUS = ("new", "needs_followup", "hot")
ACTION_RISK = ("low", "medium", "high")
SIGNAL_TYPES = ("missed_followup", "bot_qa", "custom")
AGENT_IDS = ("sales-ops-agent", "growth-agent", "ops-lead-agent")
