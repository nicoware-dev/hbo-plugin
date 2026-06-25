"""Tests for file-backed state operations."""

from __future__ import annotations


def test_append_and_update_lead(state_module):
    lead = {
        "id": "lead_test_01",
        "name": "State Test",
        "source": "test",
        "segment": "commerce",
        "score": 60,
        "priority": "medium",
        "status": "new",
        "ownerAgentId": "sales-ops-agent",
        "recommendedAction": "Review",
    }
    state_module.append_lead(lead)
    updated = state_module.update_lead("lead_test_01", {"status": "hot"})
    assert updated is not None
    assert updated["status"] == "hot"


def test_update_missing_lead_returns_none(state_module):
    assert state_module.update_lead("lead_missing", {"status": "hot"}) is None


def test_remove_action_blocks_approved(state_module, rules_module):
    rules_module.approve_action("act_001")
    result = rules_module.delete_action("act_001")
    assert result["success"] is False


def test_get_dashboard_stats_score_bins(state_module):
    stats = state_module.get_dashboard_stats()
    assert "scoreBins" in stats
    assert sum(stats["scoreBins"].values()) == stats["totalLeads"]


def test_list_conversations_with_messages(state_module):
    convs = state_module.list_conversations()
    needs_review = [c for c in convs if c.get("status") == "needs_review"]
    assert len(needs_review) >= 1
    assert len(needs_review[0].get("messages", [])) >= 2


def test_get_conversation_by_id(state_module):
    conv = state_module.get_conversation("conv_001")
    assert conv is not None
    assert conv["id"] == "conv_001"
    assert state_module.get_conversation("conv_missing") is None


def test_reset_demo_restores_leads(state_module):
    before = len(state_module.list_leads())
    state_module.append_lead(
        {
            "id": "lead_temp",
            "name": "Temp",
            "source": "test",
            "segment": "x",
            "score": 1,
            "priority": "low",
            "status": "new",
            "ownerAgentId": "sales-ops-agent",
            "recommendedAction": "x",
        }
    )
    assert len(state_module.list_leads()) == before + 1
    state_module.reset_demo_data()
    assert len(state_module.list_leads()) == before
