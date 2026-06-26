import { getSDK } from "./api/client";
import { useFetch } from "./api/hooks";
import { ApiUnavailableBanner } from "./components/ApiUnavailableBanner";
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
  { id: "overview", label: "Overview", badge: null },
  { id: "agents", label: "Agents", badge: null },
  { id: "workflows", label: "Workflows", badge: null },
  { id: "leads", label: "Leads", badge: null },
  { id: "actions", label: "Actions", badge: "pendingActions" },
  { id: "signals", label: "Signals", badge: "openSignals" },
  { id: "business", label: "Business", badge: null },
  { id: "audit", label: "Audit", badge: null },
  { id: "bridges", label: "Tool Bridges", badge: null },
  { id: "setup", label: "Setup", badge: null },
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
    const { data: ws } = useFetch<{ pendingActions?: number; openSignals?: number }>("/workspace");

    return React.createElement(
      "div",
      { className: "hbo-plugin-page space-y-4 p-2 sm:p-4" },
      React.createElement(ApiUnavailableBanner),
      React.createElement(
        "nav",
        { className: "flex flex-wrap gap-2", "aria-label": "Business Ops sections" },
        ...NAV.map((item) => {
          const badgeCount = item.badge ? Number(ws?.[item.badge as keyof typeof ws] ?? 0) : 0;
          return React.createElement(
            Button,
            {
              key: item.id,
              variant: page === item.id ? "default" : "outline",
              size: "sm",
              onClick: () => setPage(item.id),
            },
            badgeCount > 0
              ? `${item.label} (${badgeCount})`
              : item.label
          );
        })
      ),
      React.createElement(Page, { onNavigate: (id: string) => setPage(id as PageId) })
    );
  }

  registry.register("hbo-plugin", BusinessOpsApp);
}

registerPlugin();
