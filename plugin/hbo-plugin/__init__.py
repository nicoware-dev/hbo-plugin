"""HBO Plugin — Hermes Business Operations Plugin."""

from __future__ import annotations

from pathlib import Path

from . import tools

PLUGIN_DIR = Path(__file__).parent
SKILLS_DIR = PLUGIN_DIR / "skills"

BUNDLED_SKILLS = (
    "sales-ops",
    "growth-ops",
    "ops-lead",
    "local-demo",
    "plugin-manager",
    "composio",
    "nvidia-nemoclaw-setup",
    "stripe-link-cli",
    "demo-tour",
    "health-check",
    "export-report",
    "connect-source",
    "search-leads",
    "create-agent",
    "customize",
)


def register(ctx) -> None:
    """Register HBO Plugin tools and bundled skills with Hermes."""
    for _tool_name, schema, handler in tools.get_tool_definitions():
        ctx.register_tool(
            name=schema["name"],
            toolset="hbo",
            schema=schema,
            handler=handler,
            description=schema.get("description", ""),
        )

    for skill_name in BUNDLED_SKILLS:
        skill_md = SKILLS_DIR / skill_name / "SKILL.md"
        if skill_md.is_file():
            ctx.register_skill(skill_name, skill_md)
