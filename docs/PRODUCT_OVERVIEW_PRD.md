# HBO Plugin — Product Overview PRD

**Project name:** HBO Plugin  
**Full name:** Hermes Business Operations Plugin  
**Repository:** New repository, built from scratch  
**Document type:** Product Overview PRD  
**Status:** Draft v1  
**Language:** English  
**Primary platform:** Hermes Agent  
**Primary packaging model:** Hermes plugin + dashboard extension + profile distributions + documentation site  

---

## 1. Executive Summary

HBO Plugin, short for **Hermes Business Operations Plugin**, is a Hermes-native business operations extension designed to turn Hermes into a practical operating system for commerce and business workflows.

Instead of building a separate application outside Hermes, HBO Plugin extends Hermes itself through:

- a Hermes plugin;
- a Business Operations dashboard extension;
- bundled business operations skills;
- optional tool bridge skills;
- distributable Hermes agent profiles;
- a simple public documentation and landing site;
- demo data for a generic commerce operations workspace.

The goal is to package a complete business operations layer inside the Hermes ecosystem.

HBO Plugin should allow users to install a set of business operations capabilities into Hermes and quickly run specialized agents for:

1. inbound sales operations;
2. outbound growth and lead generation;
3. operational leadership and daily prioritization.

The system should be usable with demo data out of the box, but also connect to external tools through user-selected bridge skills such as Composio, WithOne / One CLI, n8n, or local/manual data workflows.

---

## 2. Product Thesis

Most small and mid-sized commerce businesses do not need another CRM, another inbox, or another automation platform.

They need a practical way for an agent to understand what is happening across their existing tools and help them act.

Their operations usually live across:

- Google Sheets;
- HubSpot or another CRM;
- WhatsApp or marketplace messages;
- bot conversation logs;
- Google Places lead lists;
- Telegram or Slack notifications;
- manual spreadsheets;
- existing n8n automations;
- various APIs and business tools.

Hermes already provides the agent runtime, profile system, skills, plugins, dashboard, and extensibility primitives.

Therefore, the best product is not a separate business app.

The best product is a **Hermes-native business operations package**.

HBO Plugin gives Hermes the business context, UI, agent profiles, skills, and tool bridge instructions required to operate real commercial workflows.

---

## 3. One-Liner

> **HBO Plugin is a Hermes-native business operations plugin that adds specialized agent profiles, business workflows, dashboard views, and tool bridge skills for commerce teams.**

Alternative longer version:

> HBO Plugin turns Hermes into a business operations workspace by adding a dashboard extension, bundled skills, profile distributions, demo data, and optional integrations through Composio, WithOne / One CLI, n8n, or local workflows.

---

## 4. Product Positioning

### 4.1 What HBO Plugin Is

HBO Plugin is:

- a Hermes-native plugin;
- a dashboard extension for business operations;
- a profile distribution pack for specialized business agents;
- a skills package for sales, growth, operations, and integrations;
- a demo workspace for commerce operations;
- a documentation site for installation, setup, and usage;
- a reusable base for business-specific Hermes deployments.

### 4.2 What HBO Plugin Is Not

HBO Plugin is not:

- a standalone SaaS app;
- a CRM replacement;
- a WhatsApp inbox;
- a generic chatbot;
- a full automation platform;
- an n8n replacement;
- a Composio-only project;
- a WithOne-only project;
- a private business implementation;
- a hardcoded demo for one company.

### 4.3 Product Category

The intended category is:

```text
Hermes-native business operations extension
```

or:

```text
Agent-native commerce operations plugin
```

---

## 5. Target Users

### 5.1 Primary Users

HBO Plugin is designed for:

- SMB commerce operators;
- e-commerce owners;
- marketplace sellers;
- WhatsApp-first businesses;
- consultants implementing AI operations;
- developers building Hermes-based business agents;
- business teams that use spreadsheets, CRMs, and messaging channels.

### 5.2 Technical Level

The product should be usable by non-technical users with help from Hermes.

The ideal experience is:

```text
User gives Hermes an installation prompt.
Hermes installs the plugin.
Hermes installs the profiles.
Hermes loads demo data.
Hermes configures the selected tool bridge.
Hermes opens the dashboard.
Hermes explains what to do next.
```

The user should not need to understand every API, CLI, or integration detail before seeing value.

---

## 6. Core Use Case

The public demo should focus on a generic commerce operations scenario.

Suggested demo name:

```text
Commerce Ops Demo
```

or:

```text
SMB Commerce Demo
```

The demo should not mention any private business name or product category.

It should include sample data such as:

- leads;
- prospects;
- inbound customer questions;
- bot answers;
- marketplace-style messages;
- follow-up tasks;
- outreach batches;
- pending actions;
- agent activity;
- daily briefing examples.

The demo should show how three specialized Hermes profiles can coordinate a business operation.

---

## 7. Core Product Promise

HBO Plugin should help Hermes answer:

```text
What happened in the business?
Which leads or conversations need attention?
Which prospects should be prioritized?
What should each agent do next?
Which actions require approval?
What changed after execution?
What should the team focus on today?
```

The plugin should make this visible through:

- dashboard pages;
- agent cards;
- workflows;
- signal lists;
- action queues;
- audit events;
- briefings;
- demo data;
- profile-specific skills.

---

## 8. Packaging Model

HBO Plugin should be packaged as a new repository with four main product surfaces:

```text
1. Hermes plugin
2. Hermes dashboard extension
3. Hermes profile distributions
4. Documentation / landing site
```

### 8.1 Hermes Plugin

The plugin contains the shared business operations functionality.

It should include:

- plugin manifest;
- tools;
- business schemas;
- local demo state;
- skill files;
- bridge instructions;
- dashboard extension;
- backend dashboard API routes if needed;
- demo data.

### 8.2 Dashboard Extension

The dashboard extension adds a Business Ops area inside Hermes.

The dashboard should show the operational workspace visually.

Recommended top-level tab:

```text
Business Ops
```

Inside that tab, the plugin should provide multiple internal pages or views.

Recommended views:

```text
Overview
Agents
Workflows
Leads
Actions
Audit
Tool Bridges
Setup
```

The goal is to keep one top-level Hermes dashboard tab while providing enough internal navigation for the business workflow.

### 8.3 Profile Distributions

The project should include three Hermes profile distributions:

```text
Sales Ops Agent
Growth Agent
Ops Lead Agent
```

Each profile distribution should include:

- `distribution.yaml`;
- `SOUL.md`;
- `config.yaml`;
- bundled skills;
- optional cron definitions;
- README;
- setup notes.

The profiles represent different operational roles, not separate apps.

### 8.4 Documentation Site

The repository should include a simple documentation and landing site.

Recommended package:

```text
apps/docs
```

Recommended framework:

```text
Docusaurus
```

The documentation site should explain:

- what HBO Plugin is;
- how to install it;
- how to use the demo prompt;
- how the plugin works;
- what profiles are included;
- what skills are included;
- what tool bridges are supported;
- how the dashboard works;
- how to load demo data;
- how to extend the system.

---

## 9. Agent Profiles

HBO Plugin should start with three profiles maximum.

This keeps the product easy to explain while still showing a multi-agent operating model.

### 9.1 Sales Ops Agent

**Purpose:** Handle inbound commercial operations.

This profile focuses on:

- inbound leads;
- customer questions;
- marketplace-style messages;
- bot answer review;
- missed follow-ups;
- handoff needs;
- sales response quality.

Typical tasks:

```text
Review inbound conversations.
Detect hot leads.
Find unanswered customer questions.
Flag weak bot answers.
Create follow-up recommendations.
Prepare message drafts.
Suggest HubSpot or sheet updates.
```

Example outputs:

```text
Follow-up needed for Lead #42.
Bot response may be incomplete.
Customer asked about shipping and has not received a clear answer.
This lead should be escalated to a human.
```

### 9.2 Growth Agent

**Purpose:** Handle outbound lead generation and growth operations.

This profile focuses on:

- prospect lists;
- Google Places-style lead sources;
- lead scoring;
- outreach planning;
- segmentation;
- campaign preparation;
- follow-up scheduling.

Typical tasks:

```text
Score prospect lists.
Find high-fit wholesale leads.
Create outreach batches.
Draft outreach messages.
Prepare follow-up sequences.
Recommend CRM updates.
```

Example outputs:

```text
12 high-fit prospects are ready for outreach.
This lead is missing a contact channel.
This batch should be prioritized this week.
```

### 9.3 Ops Lead Agent

**Purpose:** Coordinate the work of the other agents.

This profile focuses on:

- daily briefings;
- action prioritization;
- workflow coordination;
- pending approvals;
- operational summaries;
- leadership-level recommendations.

Typical tasks:

```text
Summarize today’s sales and growth priorities.
Compare Sales Ops and Growth signals.
Recommend what to approve first.
Generate a daily business briefing.
Track unresolved issues.
```

Example outputs:

```text
Today’s priority is to approve Outreach Batch #3 and review 4 inbound follow-ups.
Sales Ops found 5 risks.
Growth Agent found 9 high-fit prospects.
3 actions require approval.
```

---

## 10. Core Workflows

HBO Plugin should show a maximum of three main workflows.

### 10.1 Inbound Sales Workflow

Goal:

```text
Help the Sales Ops Agent identify and act on inbound sales opportunities.
```

Inputs:

- demo conversation logs;
- marketplace-style questions;
- bot answers;
- lead records;
- follow-up status;
- optional CRM or sheet data.

Outputs:

- hot lead signals;
- follow-up recommendations;
- bot QA flags;
- message drafts;
- action proposals;
- dashboard updates.

### 10.2 Outbound Growth Workflow

Goal:

```text
Help the Growth Agent turn prospect data into prioritized outreach actions.
```

Inputs:

- demo prospect list;
- Google Sheets data;
- Google Places-style lead data;
- optional HubSpot status;
- previous outreach state.

Outputs:

- lead scores;
- priority segments;
- outreach batches;
- message drafts;
- follow-up tasks;
- action proposals.

### 10.3 Daily Ops Briefing Workflow

Goal:

```text
Help the Ops Lead Agent produce a clear business briefing from all available signals.
```

Inputs:

- inbound signals;
- outbound signals;
- pending actions;
- executed actions;
- audit events;
- agent activity.

Outputs:

- daily briefing;
- top priorities;
- pending approvals;
- risks;
- recommended next actions.

---

## 11. Tool Bridge Strategy

HBO Plugin should not depend on one integration tool.

Instead, it should provide bridge skills that teach Hermes how to use different external tool strategies.

### 11.1 Supported Bridge Options

Initial bridge options:

```text
Composio
WithOne / One CLI
n8n
Local demo data
Manual CSV / Google Sheets-style import
```

### 11.2 Bridge Skill Philosophy

Each bridge should be packaged as a skill.

A bridge skill should explain:

- what the bridge is;
- when to use it;
- how to install it;
- how to authenticate;
- how to test it;
- how to read data;
- how to write data;
- how to troubleshoot common errors;
- when to fallback to another bridge.

### 11.3 Recommended Default

For the public demo, the default should be:

```text
Local demo data first
Composio as recommended external bridge
WithOne / One CLI and n8n as supported alternatives
```

This reduces friction while still showing a path to real tool connectivity.

### 11.4 Composio

Composio should be presented as a mature integration option for connecting Hermes workflows to external tools.

Potential uses:

- Google Sheets;
- HubSpot;
- Gmail;
- Telegram or Slack where available;
- other business apps.

### 11.5 WithOne / One CLI

WithOne / One CLI should be presented as an alternative CLI-first tool bridge.

Potential uses:

- CLI-driven external operations;
- agent-friendly tool calls;
- environments where WithOne is already configured;
- workflows where direct CLI control is preferred.

### 11.6 n8n

n8n should be presented as an optional automation and routing layer.

Potential uses:

- background syncs;
- scheduled workflows;
- visual automations;
- existing client workflows;
- webhook routing;
- integrations outside the primary bridge.

n8n is not required for the core demo.

---

## 12. Dashboard Product Requirements

The Business Ops dashboard tab should make the system understandable at a glance.

### 12.1 Overview View

Shows:

- demo workspace status;
- active agents;
- total leads;
- pending actions;
- open signals;
- recent briefings;
- selected tool bridge;
- setup status.

### 12.2 Agents View

Shows the three agent profiles:

```text
Sales Ops Agent
Growth Agent
Ops Lead Agent
```

For each agent:

- role;
- active workflows;
- recent activity;
- signals generated;
- actions proposed;
- next recommended command.

### 12.3 Workflows View

Shows:

```text
Inbound Sales
Outbound Growth
Daily Ops Briefing
```

For each workflow:

- purpose;
- owner agent;
- data sources;
- last run;
- current state;
- generated outputs.

### 12.4 Leads View

Shows demo leads or prospects.

Useful columns:

- name;
- source;
- segment;
- score;
- priority;
- status;
- owner agent;
- recommended action.

### 12.5 Actions View

Shows proposed actions.

Useful columns:

- title;
- proposing agent;
- source signal;
- risk;
- status;
- approve/reject controls;
- execution target.

### 12.6 Audit View

Shows:

- who acted;
- which agent proposed;
- what data was used;
- what was approved;
- what was executed;
- what result was produced.

### 12.7 Tool Bridges View

Shows available bridge options:

```text
Composio
WithOne / One CLI
n8n
Local demo data
Manual import
```

For each bridge:

- status;
- setup instructions;
- test action;
- related skill;
- current configuration.

### 12.8 Setup View

Shows:

- installation checklist;
- demo prompt;
- profile installation status;
- loaded demo data;
- next command to run.

---

## 13. Demo Data

The public demo should use safe synthetic or sanitized commerce data.

Do not include real private data.

Recommended demo entities:

```text
Leads
Prospects
Conversation logs
Bot answers
Action proposals
Agent activity
Audit events
Briefings
```

The demo data should be generic.

Avoid:

```text
private company names
real phone numbers
real emails
real customer messages
real product pricing
real marketplace account data
real CRM IDs
API keys
tokens
credentials
```

---

## 14. Installation Experience

The ideal installation experience should be prompt-driven.

The documentation site should provide a copy-paste prompt that a user can give to Hermes.

Example prompt:

```text
Install HBO Plugin from this repository.

Please:
1. review the README and installation docs,
2. install the Hermes Business Operations plugin,
3. install the Sales Ops, Growth, and Ops Lead profile distributions,
4. load the Commerce Ops Demo workspace,
5. use local demo data first,
6. open the Hermes dashboard,
7. verify that the Business Ops tab works,
8. run the demo briefing workflow,
9. explain the available tool bridge options.
```

The setup should be designed so Hermes can guide the user.

---

## 15. Documentation Site Requirements

The docs site should include:

### 15.1 Home

Clear explanation of:

- what HBO Plugin is;
- what it adds to Hermes;
- what problem it solves;
- what the demo shows.

### 15.2 Install

Step-by-step installation.

Include:

- plugin install;
- profile install;
- demo data load;
- dashboard launch;
- verification steps.

### 15.3 Demo Prompt

Copy-paste prompt for Hermes.

### 15.4 Plugin

Explain:

- plugin purpose;
- included tools;
- included skills;
- dashboard extension;
- demo data.

### 15.5 Profiles

Explain:

- Sales Ops Agent;
- Growth Agent;
- Ops Lead Agent;
- when to use each.

### 15.6 Skills

Explain included skills:

- sales ops workflow;
- growth workflow;
- daily briefing;
- bridge setup skills;
- demo workspace skill.

### 15.7 Tool Bridges

Explain:

- Composio;
- WithOne / One CLI;
- n8n;
- local demo data;
- manual import.

### 15.8 Dashboard

Explain the Business Ops dashboard tab and internal views.

### 15.9 Demo Data

Explain the included commerce demo data.

### 15.10 Extension

Explain how future users or Hermes can extend the plugin.

---

## 16. Proposed Repository Structure

```text
hbo-plugin/
  apps/
    docs/
      # Docusaurus landing and documentation site

  plugin/
    hbo-plugin/
      plugin.yaml
      __init__.py
      tools.py
      schemas.py
      state.py
      business_rules.py

      bridges/
        composio.md
        withone.md
        n8n.md
        local_demo.md

      skills/
        sales-ops/
          SKILL.md
        growth-ops/
          SKILL.md
        ops-lead/
          SKILL.md
        composio-setup/
          SKILL.md
        withone-setup/
          SKILL.md
        n8n-setup/
          SKILL.md
        local-demo-setup/
          SKILL.md

      dashboard/
        manifest.json
        plugin_api.py
        dist/
          index.js
          style.css

      data/
        commerce-demo.json
        sample-leads.json
        sample-conversations.json
        sample-actions.json

  profiles/
    sales-ops-agent/
      distribution.yaml
      SOUL.md
      config.yaml
      skills/
      cron/
      README.md

    growth-agent/
      distribution.yaml
      SOUL.md
      config.yaml
      skills/
      cron/
      README.md

    ops-lead-agent/
      distribution.yaml
      SOUL.md
      config.yaml
      skills/
      cron/
      README.md

  examples/
    commerce-demo/
      sample-leads.csv
      sample-conversations.json
      sample-actions.json
      README.md

  docs/
    PRODUCT_OVERVIEW_PRD.md
    TECHNICAL_SPEC.md
    DEMO_SCRIPT.md
    PLUGIN_ARCHITECTURE.md
    PROFILE_DISTRIBUTIONS.md
    DASHBOARD_EXTENSION.md
    TOOL_BRIDGES.md

  README.md
  AGENTS.md
  LICENSE
```

---

## 17. Feature Prioritization

### 17.1 Must Have

```text
Hermes plugin package
Business Ops dashboard tab
Local demo data
Sales Ops profile distribution
Growth profile distribution
Ops Lead profile distribution
Bundled skills
Bridge setup skills
Docs landing site
Demo installation prompt
Commerce Ops Demo workspace
```

### 17.2 Should Have

```text
Dashboard internal pages
Action queue
Agent activity cards
Workflow view
Audit view
Composio setup skill
WithOne setup skill
n8n setup skill
Demo briefing workflow
```

### 17.3 Could Have

```text
Theme customization
More profile distributions
More demo datasets
MCP bridge
Additional dashboard slots
Optional Docusaurus blog/changelog
```

### 17.4 Not Now

```text
Standalone SaaS app
Separate backend service
Full CRM
Real customer data
Private business-specific demo
Automatic mass outreach
Billing
Multi-user permissions
Enterprise integrations
```

---

## 18. Business Model Direction

The initial commercial model is not pure SaaS.

A better starting model is:

```text
Open-source plugin + paid implementation / customization / vertical templates
```

Potential offers:

### Starter Implementation

```text
Install HBO Plugin
Configure demo workspace
Connect one tool bridge
Train user on profiles
```

### Commerce Ops Setup

```text
Configure Sales Ops, Growth, and Ops Lead agents
Connect Google Sheets / CRM / messaging tools
Customize workflows
Set up daily briefing
```

### Custom Business Operations Pack

```text
Custom profile distributions
Custom skills
Custom dashboard views
Custom tool bridge instructions
Custom workflows
```

Later, the project could evolve into:

- paid templates;
- managed setup;
- hosted profiles;
- marketplace of business ops skills;
- vertical-specific packages.

---

## 19. Success Criteria

The project succeeds if a user can understand and demo the following quickly:

1. HBO Plugin installs inside Hermes.
2. It adds a Business Ops dashboard tab.
3. It includes three specialized profile distributions.
4. It includes bundled business operations skills.
5. It runs with demo commerce data out of the box.
6. It supports multiple tool bridge options.
7. It shows inbound sales, outbound growth, and daily briefing workflows.
8. It feels like a Hermes-native extension, not a separate app.
9. It is simple enough to explain in a hackathon demo.
10. It is general enough to sell beyond one private use case.

---

## 20. Final Product Framing

Use this as the canonical framing:

> **HBO Plugin is a Hermes-native business operations package for commerce teams.**
>
> It adds a Business Ops dashboard, bundled skills, three specialized profile distributions, demo data, and optional tool bridge workflows for Composio, WithOne / One CLI, n8n, and local data.
>
> Instead of building a separate app, HBO Plugin extends Hermes directly so users can install, run, and customize business operations workflows from inside their Hermes environment.

---

## 21. Open Questions for the Technical Specification

This document intentionally avoids deep implementation details.

The next document should answer:

1. How exactly should the Hermes plugin be structured?
2. What dashboard framework/build process should be used?
3. What state should the plugin persist locally?
4. Which Hermes plugin tools should be registered?
5. How should bridge skills call Composio, WithOne, and n8n?
6. What should the profile distributions include?
7. How should the demo data be loaded?
8. Which dashboard internal pages are required for MVP?
9. How should approvals be represented?
10. How should audit events be stored and displayed?
11. What should the installation prompt actually do step by step?
12. What should the Docusaurus site structure be?
13. What should be built first for the hackathon demo?

---

## 22. Final Recommendation

Build HBO Plugin from scratch as a Hermes-native product.

Do not build a separate app.

The MVP should focus on:

```text
plugin
dashboard tab
three profiles
skills
demo data
docs site
tool bridge options
simple commerce demo
```

That is enough to communicate the core idea clearly and leave room for a deeper technical implementation later.
