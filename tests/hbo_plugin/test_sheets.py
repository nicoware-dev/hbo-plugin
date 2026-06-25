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
