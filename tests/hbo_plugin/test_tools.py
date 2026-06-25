"""Validate plugin.yaml tool list matches runtime definitions."""

from __future__ import annotations

import re
from pathlib import Path

from tests.hbo_plugin.conftest import load_plugin_modules

PLUGIN_ROOT = Path(__file__).resolve().parents[2] / "plugin" / "hbo-plugin"


def _declared_tools_from_yaml() -> set[str]:
    text = (PLUGIN_ROOT / "plugin.yaml").read_text(encoding="utf-8")
    return set(re.findall(r"^\s+-\s+(hbo_\w+)", text, re.MULTILINE))


def test_plugin_yaml_matches_tool_definitions():
    load_plugin_modules()
    import sys

    tools = sys.modules["hbo_plugin.tools"]
    declared = _declared_tools_from_yaml()
    defined = {name for name, _, _ in tools.get_tool_definitions()}

    assert declared == defined
    assert len(declared) == 19


def test_all_tool_schemas_have_required_fields():
    load_plugin_modules()
    import sys

    tools = sys.modules["hbo_plugin.tools"]
    for name, schema, handler in tools.get_tool_definitions():
        assert schema["name"] == name
        assert schema.get("description")
        assert schema.get("parameters", {}).get("type") == "object"
        assert callable(handler)
