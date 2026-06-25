"""Tests for sales source sync."""

from __future__ import annotations

from unittest.mock import patch


def test_sync_skipped_in_local_demo(rules_module, state_module):
    state_module.set_selected_bridge("local-demo")
    with patch("hbo_plugin.sources.bridge.is_available", return_value=False):
        result = rules_module.sync_sales_sources()
    assert result["success"] is True
    assert result.get("skipped") is True
    assert result.get("auditEvent", {}).get("eventType") == "source_sync"


def test_sync_skipped_without_sheet_id(rules_module, state_module):
    state_module.set_selected_bridge("composio")
    with patch("hbo_plugin.sources.bridge.is_available", return_value=True):
        result = rules_module.sync_sales_sources()
    assert result["success"] is True
    assert result.get("skipped") is True
    assert "spreadsheet" in result.get("message", "").lower()


def test_outbound_growth_includes_outreach_preview(rules_module):
    result = rules_module.run_workflow("outbound_growth")
    assert result["success"] is True
    drafts = result["outputs"]["outreachBatch"].get("draftMessages", [])
    assert len(drafts) >= 1
    assert "preview" in drafts[0]
    actions = result["outputs"]["actionProposals"]
    assert any(a.get("outreachPreview") for a in actions)
