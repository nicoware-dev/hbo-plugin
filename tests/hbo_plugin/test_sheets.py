"""Tests for Google Sheets import helpers."""

from __future__ import annotations

import sys


def test_clean_phone_preserves_plus_prefix(demo_data_dir):
    sheets = sys.modules["hbo_plugin.sources.sheets"]
    row = ["", "", "", "'+5491112345678"]
    assert sheets._clean_phone(row, 3) == "+5491112345678"


def test_clean_phone_strips_formula_error(demo_data_dir):
    sheets = sys.modules["hbo_plugin.sources.sheets"]
    row = ["", "", "", "#ERROR!"]
    assert sheets._clean_phone(row, 3) == ""


def test_clean_phone_adds_plus_for_long_number(demo_data_dir):
    sheets = sys.modules["hbo_plugin.sources.sheets"]
    row = ["", "", "", "5491112345678"]
    assert sheets._clean_phone(row, 3) == "+5491112345678"


def test_search_spreadsheets_uses_run_argv(demo_data_dir):
    from unittest.mock import patch

    sheets = sys.modules["hbo_plugin.sources.sheets"]
    query = "Customer's leads"
    with patch("hbo_plugin.sources.sheets.run_argv") as mock_argv:
        mock_argv.return_value = {"results": [{"id": "sheet_1"}]}
        results = sheets.search_spreadsheets(query)
    mock_argv.assert_called_once_with(["search", query])
    assert results == [{"id": "sheet_1"}]
