"""Tests for safe Composio CLI argument handling."""

from __future__ import annotations

import json
from unittest.mock import patch

import pytest


@pytest.fixture
def composio_module():
    import importlib
    import sys

    if "hbo_plugin.sources.composio_client" in sys.modules:
        return sys.modules["hbo_plugin.sources.composio_client"]
    return importlib.import_module("hbo_plugin.sources.composio_client")


def test_run_argv_native_passes_json_as_argv(composio_module):
    payload = {
        "recipient_email": "a@example.com",
        "subject": "Customer's quote",
        "body": "Hi, here's the proposal: $100 && echo bad\nLine two",
    }
    with patch.object(composio_module, "_has_composio", return_value=True), patch.object(
        composio_module, "_has_composio_wsl", return_value=False
    ), patch.object(composio_module, "_run_native_argv") as mock_run:
        mock_run.return_value = {"ok": True}
        composio_module.run_argv(["execute", "GMAIL_SEND_EMAIL"], payload)
    args = mock_run.call_args[0][0]
    assert args[0] == "execute"
    assert args[1] == "GMAIL_SEND_EMAIL"
    assert args[2] == "-d"
    parsed = json.loads(args[3])
    assert parsed["subject"] == "Customer's quote"
    assert "&& echo bad" in parsed["body"]


def test_run_argv_wsl_uses_quoted_script(composio_module):
    import sys

    payload = {"spreadsheet_id": "sheet_123", "range": "Leads Q1!A1:Z10"}
    with patch.object(sys, "platform", "win32"), patch.object(
        composio_module, "_has_composio_wsl", return_value=True
    ), patch.object(composio_module.subprocess, "run") as mock_run:
        mock_run.return_value = type("R", (), {"returncode": 0, "stdout": "{}", "stderr": ""})()
        composio_module.run_argv(["execute", "GOOGLESHEETS_VALUES_GET"], payload)
    assert mock_run.call_count >= 2
    write_call = mock_run.call_args_list[0]
    script_bytes = write_call.kwargs.get("input") or write_call[1].get("input")
    script = script_bytes.decode("utf-8")
    assert "GOOGLESHEETS_VALUES_GET" in script
    assert "Leads Q1" in script


def test_gmail_send_uses_run_argv():
    from hbo_plugin.sources import gmail

    with patch("hbo_plugin.sources.gmail.is_available", return_value=True), patch(
        "hbo_plugin.sources.gmail.run_argv"
    ) as mock_argv:
        mock_argv.return_value = {"data": {}}
        result = gmail.send_email(
            "test@example.com",
            "Subject with 'quotes'",
            "Body with\nnewlines and $pecial",
        )
    assert result["success"] is True
    mock_argv.assert_called_once()
    call_args = mock_argv.call_args
    assert call_args[0][0] == ["execute", "GMAIL_SEND_EMAIL"]
    assert call_args[1]["data"]["subject"] == "Subject with 'quotes'"
