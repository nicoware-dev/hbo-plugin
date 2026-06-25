"""HBO Plugin tool handlers — delegates to state and business_rules."""

from __future__ import annotations

import json
from typing import Any, Callable

from . import business_rules, schemas, state

ToolDef = tuple[str, dict[str, Any], Callable[..., str]]


def _json_response(payload: Any) -> str:
    return json.dumps(payload, default=str)


def get_tool_definitions() -> list[ToolDef]:
    """Return (name, schema, handler) tuples for all HBO tools."""
    return [
        (
            "hbo_get_workspace",
            {
                "name": "hbo_get_workspace",
                "description": "Return current Business Ops workspace summary.",
                "parameters": {"type": "object", "properties": {}},
            },
            lambda params, **_: _json_response(state.get_workspace_summary()),
        ),
        (
            "hbo_list_agents",
            {
                "name": "hbo_list_agents",
                "description": "Return configured agent profiles and recent activity.",
                "parameters": {"type": "object", "properties": {}},
            },
            lambda params, **_: _json_response(state.list_agents()),
        ),
        (
            "hbo_list_workflows",
            {
                "name": "hbo_list_workflows",
                "description": "List available Business Ops demo workflows.",
                "parameters": {"type": "object", "properties": {}},
            },
            lambda params, **_: _json_response(state.list_workflows()),
        ),
        (
            "hbo_run_workflow",
            {
                "name": "hbo_run_workflow",
                "description": "Run one of the demo workflows.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "workflow": {
                            "type": "string",
                            "enum": list(schemas.WORKFLOWS),
                        }
                    },
                    "required": ["workflow"],
                },
            },
            lambda params, **_: _json_response(
                business_rules.run_workflow(params.get("workflow", ""))
            ),
        ),
        (
            "hbo_list_leads",
            {
                "name": "hbo_list_leads",
                "description": "Return demo leads and prospects.",
                "parameters": {"type": "object", "properties": {}},
            },
            lambda params, **_: _json_response(state.list_leads()),
        ),
        (
            "hbo_detect_signals",
            {
                "name": "hbo_detect_signals",
                "description": "Detect open business signals from demo state.",
                "parameters": {"type": "object", "properties": {}},
            },
            lambda params, **_: _json_response(business_rules.detect_signals()),
        ),
        (
            "hbo_list_actions",
            {
                "name": "hbo_list_actions",
                "description": "Return action proposals.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "status": {
                            "type": "string",
                            "enum": list(schemas.ACTION_STATUS),
                        }
                    },
                },
            },
            lambda params, **_: _json_response(
                state.list_actions(status=params.get("status"))
            ),
        ),
        (
            "hbo_approve_action",
            {
                "name": "hbo_approve_action",
                "description": "Approve a pending action proposal.",
                "parameters": {
                    "type": "object",
                    "properties": {"actionId": {"type": "string"}},
                    "required": ["actionId"],
                },
            },
            lambda params, **_: _json_response(
                business_rules.approve_action(params.get("actionId", ""))
            ),
        ),
        (
            "hbo_reject_action",
            {
                "name": "hbo_reject_action",
                "description": "Reject a pending action proposal.",
                "parameters": {
                    "type": "object",
                    "properties": {"actionId": {"type": "string"}},
                    "required": ["actionId"],
                },
            },
            lambda params, **_: _json_response(
                business_rules.reject_action(params.get("actionId", ""))
            ),
        ),
        (
            "hbo_generate_briefing",
            {
                "name": "hbo_generate_briefing",
                "description": "Generate a daily business briefing from demo state.",
                "parameters": {"type": "object", "properties": {}},
            },
            lambda params, **_: _json_response(business_rules.generate_briefing()),
        ),
        (
            "hbo_list_audit_events",
            {
                "name": "hbo_list_audit_events",
                "description": "Return audit events for traceability.",
                "parameters": {"type": "object", "properties": {}},
            },
            lambda params, **_: _json_response(state.list_audit_events()),
        ),
        (
            "hbo_load_demo_data",
            {
                "name": "hbo_load_demo_data",
                "description": "Reset and load Business Ops Demo data from bundled files.",
                "parameters": {"type": "object", "properties": {}},
            },
            lambda params, **_: _json_response(state.load_demo_data()),
        ),
    ]
