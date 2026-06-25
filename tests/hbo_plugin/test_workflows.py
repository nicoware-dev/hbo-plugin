"""Dedicated workflow runner tests."""

from __future__ import annotations

import json


def test_inbound_sales_bot_qa_links_conversation(rules_module):
    result = rules_module.run_workflow("inbound_sales")
    flags = result["outputs"]["botQaFlags"]
    assert any(f.get("conversationId") == "conv_001" for f in flags)
    actions = result["outputs"]["actionProposals"]
    assert any(a.get("source") == "conv_001" for a in actions)


def test_outbound_growth_includes_outreach_preview(rules_module):
    result = rules_module.run_workflow("outbound_growth")
    actions = result["outputs"]["actionProposals"]
    previews = [a for a in actions if a.get("outreachPreview")]
    assert len(previews) >= 1
    assert "Hi " in previews[0]["outreachPreview"]


def test_daily_briefing_priorities(rules_module):
    result = rules_module.run_workflow("daily_ops_briefing")
    briefing = result["outputs"]["briefing"]
    assert briefing["title"] == "Daily Ops Briefing"
    assert len(briefing["priorities"]) >= 1
    assert briefing["pendingApprovals"] >= 0


def test_workflow_run_persisted(rules_module, demo_data_dir):
    rules_module.run_workflow("outbound_growth")
    runs = json.loads((demo_data_dir / "workflow_runs.json").read_text(encoding="utf-8"))
    assert "outbound_growth" in runs
    assert runs["outbound_growth"]["status"] == "completed"
