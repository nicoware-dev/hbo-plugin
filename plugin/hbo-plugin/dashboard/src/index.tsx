import { getSDK } from "./api/client";
import { OverviewPage } from "./routes/Overview";
import { AgentsPage } from "./routes/Agents";
import { WorkflowsPage } from "./routes/Workflows";
import { LeadsPage } from "./routes/Leads";
import { ActionsPage } from "./routes/Actions";
import { SignalsPage } from "./routes/Signals";
import { AuditPage } from "./routes/Audit";
import { ToolBridgesPage } from "./routes/ToolBridges";
import { SetupPage } from "./routes/Setup";
import { BusinessPage } from "./routes/Business";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "agents", label: "Agents" },
  { id: "workflows", label: "Workflows" },
  { id: "leads", label: "Leads" },
  { id: "actions", label: "Actions" },
  { id: "signals", label: "Signals" },
  { id: "business", label: "Business" },
  { id: "audit", label: "Audit" },
  { id: "bridges", label: "Tool Bridges" },
  { id: "setup", label: "Setup" },
] as const;

type PageId = (typeof NAV)[number]["id"];

function registerPlugin() {
  const SDK = window.__HERMES_PLUGIN_SDK__;
  const registry = window.__HERMES_PLUGINS__;
  if (!SDK || !registry) return;

  const { React, hooks, components } = SDK;
  const { useState } = hooks;
  const { Button } = components;

  const pages: Record<PageId, typeof OverviewPage> = {
    overview: OverviewPage,
    agents: AgentsPage,
    workflows: WorkflowsPage,
    leads: LeadsPage,
    actions: ActionsPage,
    signals: SignalsPage,
    business: BusinessPage,
    audit: AuditPage,
    bridges: ToolBridgesPage,
    setup: SetupPage,
  };

  function BusinessOpsApp() {
    const [page, setPage] = useState<PageId>("overview");
    const Page = pages[page] ?? OverviewPage;

    return React.createElement(
      "div",
      { className: "hbo-plugin-page space-y-4 p-2 sm:p-4" },
      React.createElement(
        "nav",
        { className: "flex flex-wrap gap-2", "aria-label": "Business Ops sections" },
        ...NAV.map((item) =>
          React.createElement(
            Button,
            {
              key: item.id,
              variant: page === item.id ? "default" : "outline",
              size: "sm",
              onClick: () => setPage(item.id),
            },
            item.label
          )
        )
      ),
      React.createElement(Page, { onNavigate: (id: string) => setPage(id as PageId) })
    );
  }

  registry.register("hbo-plugin", BusinessOpsApp);
}

registerPlugin();
