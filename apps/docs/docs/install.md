---
sidebar_position: 2
title: Install
---

# Installation

## 1. Install the Hermes plugin

```bash
cp -r plugin/hbo-plugin ~/.hermes/plugins/hbo-plugin
hermes plugins enable hbo-plugin
```

## 2. Install profile distributions

```bash
hermes profile install ./profiles/sales-ops-agent --alias sales-ops
hermes profile install ./profiles/growth-agent --alias growth
hermes profile install ./profiles/ops-lead-agent --alias ops-lead
```

## 3. Load demo data

Ask Hermes to call `hbo_load_demo_data`, or run it from a session with the plugin enabled.

## 4. Open the dashboard

Restart Hermes and open the **Business Ops** tab in the web dashboard.
