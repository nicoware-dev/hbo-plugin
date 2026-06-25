"""Tests for execution and bridge modules."""

from __future__ import annotations

from unittest.mock import patch

import pytest


def test_should_execute_only_in_composio_mode(rules_module, state_module):
    import sys

    execution = sys.modules["hbo_plugin.execution"]

    state_module.set_selected_bridge("local-demo")
    action = {"actionType": "send_email", "source": "lead_001"}
    assert execution.should_execute(action) is False

    state_module.set_selected_bridge("composio")
    assert execution.should_execute(action) is True


def test_approve_executes_email_in_composio_mode(rules_module, state_module):
    state_module.set_selected_bridge("composio")
    with patch("hbo_plugin.sources.gmail.send_email") as mock_send:
        mock_send.return_value = {"success": True, "tool": "GMAIL_SEND_EMAIL", "data": {}}
        result = rules_module.approve_action("act_001")
    assert result["success"] is True
    assert result["action"]["status"] == "executed"
    assert result["execution"]["success"] is True
    mock_send.assert_called_once()


def test_approve_skips_execution_in_local_demo_mode(rules_module, state_module):
    state_module.set_selected_bridge("local-demo")
    with patch("hbo_plugin.sources.gmail.send_email") as mock_send:
        result = rules_module.approve_action("act_001")
    assert result["success"] is True
    assert result["action"]["status"] == "approved"
    assert "execution" not in result
    mock_send.assert_not_called()


def test_send_approval_email_tool(rules_module):
    with patch("hbo_plugin.sources.gmail.send_email") as mock_send:
        mock_send.return_value = {"success": True, "tool": "GMAIL_SEND_EMAIL", "data": {}}
        result = rules_module.send_approval_email(
            recipient_email="test@example.com",
            subject="Hello",
            body="Test body",
        )
    assert result["success"] is True
    mock_send.assert_called_once_with("test@example.com", "Hello", "Test body")


def test_bridge_status(rules_module):
    with patch("hbo_plugin.sources.bridge.is_available", return_value=False):
        status = rules_module.get_bridge_status()
    assert status["mode"] == "local-demo"
    assert any(b["id"] == "composio" for b in status["bridges"])


def test_mock_stripe_executes_in_local_demo(rules_module, state_module):
    state_module.set_selected_bridge("local-demo")
    result = rules_module.approve_action("act_004")
    assert result["success"] is True
    assert result["action"]["status"] == "executed"
    assert result["execution"]["mock"] is True
    assert "stripe link spend" in result["execution"]["command"].lower()
