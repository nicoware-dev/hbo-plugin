---
name: sales-ops
description: Inbound sales operations — review conversations, detect hot leads, flag bot QA issues, and recommend follow-ups. Use when handling customer messages, marketplace inquiries, or sales follow-up gaps.
---

# Sales Ops

Handles inbound commercial operations for the Business Ops Demo workspace.

## When to use

- Review inbound conversations and customer questions
- Detect hot leads and missed follow-ups
- Flag weak or incomplete bot answers
- Create follow-up recommendations and action proposals

## Tools

Use HBO Plugin tools: `hbo_list_leads`, `hbo_detect_signals`, `hbo_list_actions`, `hbo_run_workflow` with `inbound_sales`.

## Workflows

Run `hbo_run_workflow` with `workflow: inbound_sales` to scan conversations and generate signals.
