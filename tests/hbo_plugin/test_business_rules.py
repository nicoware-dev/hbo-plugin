"""Tests for workflow and approval business rules."""

from __future__ import annotations

import json


def test_run_inbound_sales_creates_outputs(rules_module, state_module, demo_data_dir):
    result = rules_module.run_workflow("inbound_sales")
    assert result["success"] is True
    outputs = result["outputs"]
    assert len(outputs["signals"]) >= 1
    assert len(outputs["actionProposals"]) >= 1
    assert len(outputs["botQaFlags"]) >= 1

    audit = state_module.list_audit_events()
    assert any(e["eventType"] == "workflow_run" for e in audit)
    runs = json.loads((demo_data_dir / "workflow_runs.json").read_text(encoding="utf-8"))
    assert "inbound_sales" in runs


def test_run_outbound_growth_creates_batch(rules_module):
    result = rules_module.run_workflow("outbound_growth")
    assert result["success"] is True
    batch = result["outputs"]["outreachBatch"]
    assert batch["leadCount"] >= 1
    assert len(result["outputs"]["leadScores"]) == 12


def test_run_daily_briefing_generates_briefing(rules_module, demo_data_dir):
    result = rules_module.run_workflow("daily_ops_briefing")
    assert result["success"] is True
    assert result["outputs"]["briefing"]["title"] == "Daily Ops Briefing"
    briefings = json.loads((demo_data_dir / "briefings.json").read_text(encoding="utf-8"))
    assert len(briefings) >= 1


def test_approve_action_updates_state_and_audit(rules_module, state_module):
    result = rules_module.approve_action("act_001")
    assert result["success"] is True
    assert result["action"]["status"] == "approved"
    audit = state_module.list_audit_events()
    assert any(e["eventType"] == "action_approved" for e in audit)


def test_reject_action_updates_state_and_audit(rules_module):
    result = rules_module.reject_action("act_002")
    assert result["success"] is True
    assert result["action"]["status"] == "rejected"


def test_reset_demo_data_restores_pending_actions(rules_module, state_module):
    rules_module.approve_action("act_001")
    state_module.reset_demo_data()
    pending = state_module.list_actions(status="pending")
    assert len(pending) == 4
