"""Recommended cron automations catalog for dashboard and docs."""

from __future__ import annotations

from typing import Any

CATALOG: list[dict[str, Any]] = [
    {
        "id": "sales-source-sync",
        "name": "Sales Source Sync",
        "agentId": "sales-ops-agent",
        "profile": "sales-ops-agent",
        "schedule": "Daily 07:00",
        "purpose": "Sync inbound sales data from Google Sheets / Gmail into HBO state.",
        "skills": ["hbo-plugin:sales-ops", "hbo-plugin:local-demo", "hbo-plugin:composio"],
        "bridge": "composio or hybrid",
        "silent": False,
        "cronFile": "profiles/sales-ops-agent/cron/sales-source-sync.md",
        "enableCommand": (
            'hermes cron add --name sales-source-sync --schedule "0 7 * * *" '
            '--agent sales-ops --prompt "Run Sales Source Sync per profiles/sales-ops-agent/cron/sales-source-sync.md"'
        ),
    },
    {
        "id": "unread-email-review",
        "name": "Unread Email Review",
        "agentId": "sales-ops-agent",
        "profile": "sales-ops-agent",
        "schedule": "Weekdays 08:00",
        "purpose": "Review unread sales emails; create follow-up signals or proposals.",
        "skills": ["hbo-plugin:sales-ops", "hbo-plugin:composio"],
        "bridge": "composio or hybrid",
        "silent": True,
        "cronFile": "profiles/sales-ops-agent/cron/unread-email-review.md",
        "enableCommand": (
            'hermes cron add --name unread-email-review --schedule "0 8 * * 1-5" '
            '--agent sales-ops --prompt "Run Unread Email Review per profiles/sales-ops-agent/cron/unread-email-review.md"'
        ),
    },
    {
        "id": "prospect-source-sync",
        "name": "Prospect Source Sync",
        "agentId": "growth-agent",
        "profile": "growth-agent",
        "schedule": "Weekly Monday 06:00",
        "purpose": "Sync prospect lists from Sheets or Places-style sources.",
        "skills": ["hbo-plugin:growth-ops", "hbo-plugin:composio"],
        "bridge": "composio or hybrid",
        "silent": False,
        "cronFile": "profiles/growth-agent/cron/prospect-source-sync.md",
        "enableCommand": (
            'hermes cron add --name prospect-source-sync --schedule "0 6 * * 1" '
            '--agent growth --prompt "Run Prospect Source Sync per profiles/growth-agent/cron/prospect-source-sync.md"'
        ),
    },
    {
        "id": "weekly-prospect-batch",
        "name": "Weekly Prospect Batch",
        "agentId": "growth-agent",
        "profile": "growth-agent",
        "schedule": "Weekly Wednesday 10:00",
        "purpose": "Build and score a weekly outbound prospect batch from synced leads.",
        "skills": ["hbo-plugin:growth-ops", "hbo-plugin:local-demo"],
        "bridge": "any",
        "silent": False,
        "cronFile": "profiles/growth-agent/cron/weekly-prospect-batch.md",
        "enableCommand": (
            'hermes cron add --name weekly-prospect-batch --schedule "0 10 * * 3" '
            '--agent growth --prompt "Run Weekly Prospect Batch per profiles/growth-agent/cron/weekly-prospect-batch.md"'
        ),
    },
    {
        "id": "daily-ops-briefing",
        "name": "Daily Ops Briefing",
        "agentId": "ops-lead-agent",
        "profile": "ops-lead-agent",
        "schedule": "Weekdays 09:00",
        "purpose": "Summarize priorities, approvals, risks after sync crons.",
        "skills": ["hbo-plugin:ops-lead", "hbo-plugin:local-demo", "hbo-plugin:composio"],
        "bridge": "any",
        "silent": True,
        "cronFile": "profiles/ops-lead-agent/cron/daily-ops-briefing.md",
        "enableCommand": (
            'hermes cron add --name daily-ops-briefing --schedule "0 9 * * 1-5" '
            '--agent ops-lead --prompt "Run Daily Ops Briefing per profiles/ops-lead-agent/cron/daily-ops-briefing.md"'
        ),
    },
    {
        "id": "weekly-ops-review",
        "name": "Weekly Ops Review",
        "agentId": "ops-lead-agent",
        "profile": "ops-lead-agent",
        "schedule": "Friday 10:00",
        "purpose": "Weekly audit rollup and process health review.",
        "skills": ["hbo-plugin:ops-lead", "hbo-plugin:local-demo"],
        "bridge": "any",
        "silent": False,
        "cronFile": "profiles/ops-lead-agent/cron/weekly-ops-review.md",
        "enableCommand": (
            'hermes cron add --name weekly-ops-review --schedule "0 10 * * 5" '
            '--agent ops-lead --prompt "Run Weekly Ops Review per profiles/ops-lead-agent/cron/weekly-ops-review.md"'
        ),
    },
]

DAILY_ORDER = [
    "sales-source-sync",
    "prospect-source-sync",
    "weekly-prospect-batch",
    "unread-email-review",
    "daily-ops-briefing",
]


def list_automations() -> dict[str, Any]:
    return {
        "automations": CATALOG,
        "recommendedOrder": DAILY_ORDER,
        "safetyNote": "Crons are recommended automations — enable manually after review.",
    }
