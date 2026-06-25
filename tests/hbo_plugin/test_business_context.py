"""Tests for business context helpers."""

from __future__ import annotations


def test_format_business_context_prompt(state_module):
    state_module.save_business_context(
        {
            "businessName": "Acme",
            "description": "Ops platform",
            "products": "CRM",
            "targetAudience": "SMB",
            "toneOfVoice": "Concise",
            "uniqueSellingPoints": "Agents",
            "customInstructions": "Approve first",
        }
    )
    block = state_module.format_business_context_prompt()
    assert "Acme" in block
    assert "Approve first" in block


def test_get_business_context_tool(state_module):
    import sys

    tools = sys.modules["hbo_plugin.tools"]
    defs = {name: handler for name, _, handler in tools.get_tool_definitions()}
    raw = defs["hbo_get_business_context"]({})
    import json

    data = json.loads(raw)
    assert "businessName" in data
    assert "promptBlock" in data
