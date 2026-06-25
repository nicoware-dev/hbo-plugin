"""Demo workflow runners — produce signals, actions, and rich outputs."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from . import state


def draft_outreach_message(lead: dict[str, Any]) -> str:
    ctx = state.get_business_context()
    business = ctx.get("businessName") or "our team"
    tone = ctx.get("toneOfVoice") or "professional and helpful"
    name = lead.get("name", "there")
    product = ctx.get("products") or "our solutions"
    return (
        f"Hi {name},\n\n"
        f"I'm reaching out from {business}. Based on your profile as a "
        f"{lead.get('segment', 'prospect')} lead, I thought {product} might be a fit.\n\n"
        f"{lead.get('recommendedAction', 'Would you be open to a short intro call?')}\n\n"
        f"Best regards,\nGrowth Team\n\n"
        f"(Tone: {tone})"
    )


def build_briefing_payload() -> dict[str, Any]:
    summary = state.get_workspace_summary()
    pending = state.list_actions(status="pending")
    signals = state.list_signals()
    return {
        "id": f"brief_{uuid4().hex[:8]}",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "title": "Daily Ops Briefing",
        "priorities": [
            f"{summary['pendingActions']} actions awaiting approval",
            f"{summary['openSignals']} open signals need review",
            f"{len(pending)} items in the action queue",
        ],
        "pendingApprovals": summary["pendingActions"],
        "risks": _detect_risks(pending, signals),
        "recommendedActions": [a.get("title", "") for a in pending[:3]],
    }


def run_inbound_sales() -> dict[str, Any]:
    signals_created: list[dict[str, Any]] = []
    actions_created: list[dict[str, Any]] = []
    bot_qa_flags: list[dict[str, Any]] = []
    follow_ups: list[dict[str, Any]] = []

    for conv in state.list_conversations():
        if conv.get("status") != "needs_review":
            continue
        flag = {
            "conversationId": conv["id"],
            "channel": conv.get("channel"),
            "issue": "Bot response may need human review",
            "summary": conv.get("summary", ""),
        }
        bot_qa_flags.append(flag)
        signals_created.append(
            state.append_signal(
                {
                    "id": f"sig_{uuid4().hex[:8]}",
                    "type": "bot_qa",
                    "conversationId": conv["id"],
                    "summary": f"Bot QA flag on {conv.get('channel', 'channel')}",
                    "ownerAgentId": "sales-ops-agent",
                }
            )
        )
        actions_created.append(
            state.append_action(
                {
                    "id": f"act_{uuid4().hex[:8]}",
                    "title": "Review bot conversation",
                    "agentId": "sales-ops-agent",
                    "source": conv["id"],
                    "risk": "low",
                    "status": "pending",
                    "description": conv.get("summary", "Conversation needs human review."),
                }
            )
        )

    for lead in state.list_leads():
        if lead.get("status") not in ("needs_followup", "hot"):
            continue
        rec = {
            "leadId": lead["id"],
            "name": lead.get("name"),
            "recommendedAction": lead.get("recommendedAction", "Follow up"),
            "priority": lead.get("priority"),
        }
        follow_ups.append(rec)
        if lead.get("status") == "needs_followup":
            action_data: dict[str, Any] = {
                "id": f"act_{uuid4().hex[:8]}",
                "title": "Create follow-up task",
                "agentId": "sales-ops-agent",
                "source": lead["id"],
                "risk": "low",
                "status": "pending",
                "description": lead.get("recommendedAction", "Follow up with lead."),
            }
            if lead.get("email"):
                action_data["actionType"] = "send_email"
                action_data["composioTool"] = "GMAIL_SEND_EMAIL"
                action_data["composioPayload"] = {
                    "recipient_email": lead["email"],
                    "subject": f"Follow-up: {lead.get('name', 'your inquiry')}",
                    "body": lead.get("recommendedAction", "Following up on your recent inquiry."),
                }
            actions_created.append(state.append_action(action_data))

    return {
        "signals": signals_created,
        "actionProposals": actions_created,
        "botQaFlags": bot_qa_flags,
        "followUpRecommendations": follow_ups,
    }


def run_outbound_growth() -> dict[str, Any]:
    leads = state.list_leads()
    scored = sorted(leads, key=lambda l: l.get("score", 0), reverse=True)
    segments: dict[str, list[str]] = {}
    for lead in scored:
        seg = lead.get("segment", "other")
        segments.setdefault(seg, []).append(lead["id"])

    growth_leads = [l for l in scored if l.get("ownerAgentId") == "growth-agent" or l.get("status") == "new"]
    outreach_batch = {
        "batchId": f"batch_{uuid4().hex[:8]}",
        "leadCount": len(growth_leads),
        "leadIds": [l["id"] for l in growth_leads],
        "segment": "wholesale" if any(l.get("segment") == "wholesale" for l in growth_leads) else "mixed",
    }

    outreach_drafts: list[dict[str, Any]] = []
    actions_created: list[dict[str, Any]] = []
    follow_up_tasks: list[dict[str, Any]] = []
    for lead in growth_leads[:2]:
        preview = draft_outreach_message(lead)
        task = {
            "leadId": lead["id"],
            "name": lead.get("name"),
            "action": lead.get("recommendedAction", "Draft outreach"),
            "preview": preview,
        }
        follow_up_tasks.append(task)
        outreach_drafts.append({"leadId": lead["id"], "name": lead.get("name"), "preview": preview})
        actions_created.append(
            state.append_action(
                {
                    "id": f"act_{uuid4().hex[:8]}",
                    "title": "Draft outreach message",
                    "agentId": "growth-agent",
                    "source": lead["id"],
                    "risk": "low",
                    "status": "pending",
                    "actionType": "outreach_preview",
                    "outreachPreview": preview,
                    "description": lead.get("recommendedAction", "Prepare first contact."),
                }
            )
        )

    return {
        "leadScores": [{"leadId": l["id"], "name": l.get("name"), "score": l.get("score")} for l in scored],
        "prioritySegments": {k: len(v) for k, v in segments.items()},
        "outreachBatch": {**outreach_batch, "draftMessages": outreach_drafts},
        "actionProposals": actions_created,
        "followUpTasks": follow_up_tasks,
    }


def run_daily_ops_briefing() -> dict[str, Any]:
    briefing = build_briefing_payload()
    state.append_briefing(briefing)
    summary = state.get_workspace_summary()
    pending = state.list_actions(status="pending")
    signals = state.list_signals()
    return {
        "briefing": briefing,
        "topPriorities": briefing["priorities"],
        "pendingApprovals": [{"id": a["id"], "title": a["title"]} for a in pending],
        "risks": briefing["risks"],
        "recommendedNextActions": briefing["recommendedActions"],
        "openSignals": len(signals),
        "workspaceStatus": summary.get("status"),
    }


def _detect_risks(
    pending: list[dict[str, Any]], signals: list[dict[str, Any]]
) -> list[str]:
    risks: list[str] = []
    hot = [a for a in pending if a.get("risk") in ("medium", "high")]
    if hot:
        risks.append(f"{len(hot)} pending actions with elevated risk")
    if len(signals) > 3:
        risks.append(f"{len(signals)} open signals may need triage")
    if not risks:
        risks.append("No critical risks detected in demo state")
    return risks
