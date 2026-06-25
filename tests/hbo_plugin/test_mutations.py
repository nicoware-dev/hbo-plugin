"""Tests for CRUD mutations and validation."""

from __future__ import annotations


def test_create_lead_rejects_invalid_score(rules_module):
    result = rules_module.create_lead({"name": "Bad Score", "score": 150})
    assert result["success"] is False
    assert "score" in result["error"]


def test_create_lead_accepts_valid_score(rules_module):
    result = rules_module.create_lead({"name": "Good Score", "score": 85})
    assert result["success"] is True
    assert result["lead"]["score"] == 85
    assert "auditEvent" in result


def test_update_lead_rejects_invalid_status(rules_module, state_module):
    lead_id = state_module.list_leads()[0]["id"]
    result = rules_module.update_lead_record(lead_id, {"status": "invalid"})
    assert result["success"] is False
    assert "status" in result["error"]


def test_create_action_returns_audit_event(rules_module):
    result = rules_module.create_action({"title": "Test action", "risk": "low"})
    assert result["success"] is True
    assert result["action"]["status"] == "pending"
    assert result["auditEvent"]["eventType"] == "action_created"
