import { getSDK } from "../api/client";
import { useFetch } from "../api/hooks";
import { BarChart, FUNNEL_COLORS } from "../components/BarChart";

type PageProps = { onNavigate: (page: string) => void };

type Stats = {
  funnel: Record<string, number>;
  segments: Record<string, number>;
  scoreBins: Record<string, number>;
  priorities: Record<string, number>;
  agentWorkload: Record<string, number>;
  signalTypes: Record<string, number>;
  auditTimeline: Record<string, number>;
  totalLeads: number;
};

export function OverviewPage({ onNavigate }: PageProps) {
  const { React, components } = getSDK();
  const { Card, CardHeader, CardTitle, CardContent, Button } = components;
  const { data: ws, loading: wsLoading, error: wsError } = useFetch<Record<string, unknown>>("/workspace");
  const { data: stats, loading: statsLoading, error: statsError } = useFetch<Stats>("/stats");

  if (wsLoading || statsLoading) {
    return React.createElement("p", { className: "p-4 text-muted-foreground" }, "Loading workspace…");
  }

  if (wsError || statsError) {
    return React.createElement(
      "div",
      { className: "p-4 space-y-2 text-destructive" },
      React.createElement("p", null, "Overview data unavailable. Restart Hermes dashboard after syncing the plugin."),
      React.createElement("p", { className: "text-sm text-muted-foreground" }, wsError || statsError)
    );
  }

  const cards = [
    ["Active agents", ws?.activeAgents],
    ["Open signals", ws?.openSignals],
    ["Pending actions", ws?.pendingActions],
    ["Total leads", stats?.totalLeads ?? 0],
    ["Bridge mode", ws?.selectedBridge],
    ["Last briefing", ws?.lastBriefingTitle ?? "—"],
  ];

  const hasTimeline = stats?.auditTimeline && Object.values(stats.auditTimeline).some((v) => v > 0);

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Overview"),
    React.createElement(
      "div",
      { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" },
      ...cards.map(([label, value]) =>
        React.createElement(
          Card,
          {
            key: String(label),
            className: label === "Pending actions" && Number(value) > 0 ? "ring-1 ring-primary/40" : undefined,
          },
          React.createElement(CardHeader, { className: "pb-2" }, React.createElement(CardTitle, { className: "text-sm" }, label)),
          React.createElement(
            CardContent,
            { className: "pt-0" },
            React.createElement("p", { className: "text-2xl font-bold" }, String(value ?? "—")),
            label === "Pending actions" &&
              Number(value) > 0 &&
              React.createElement(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "mt-2 h-7 text-xs font-normal",
                  onClick: () => onNavigate("actions"),
                },
                "Review queue"
              ),
            label === "Last briefing" &&
              ws?.lastBriefingAt &&
              React.createElement(
                "p",
                { className: "text-xs text-muted-foreground mt-1" },
                String(ws.lastBriefingAt).slice(0, 10)
              )
          )
        )
      )
    ),
    React.createElement(
      "div",
      { className: "grid gap-4 md:grid-cols-2" },
      React.createElement(BarChart, {
        title: "Lead funnel (by status)",
        data: stats?.funnel ?? {},
        colors: FUNNEL_COLORS,
      }),
      React.createElement(BarChart, {
        title: "Leads by segment",
        data: stats?.segments ?? {},
      }),
      React.createElement(BarChart, {
        title: "Score distribution",
        data: stats?.scoreBins ?? {},
      }),
      React.createElement(BarChart, {
        title: "Priority breakdown",
        data: stats?.priorities ?? {},
      }),
      hasTimeline &&
        React.createElement(BarChart, {
          title: "Audit activity (last 7 days)",
          data: stats?.auditTimeline ?? {},
        }),
      stats?.signalTypes &&
        Object.values(stats.signalTypes).some((v) => v > 0) &&
        React.createElement(BarChart, {
          title: "Open signals by type",
          data: stats.signalTypes,
        }),
      stats?.agentWorkload &&
        Object.keys(stats.agentWorkload).length > 0 &&
        React.createElement(BarChart, {
          title: "Pending actions per agent",
          data: stats.agentWorkload,
        })
    ),
    React.createElement(
      "div",
      { className: "flex flex-wrap gap-2" },
      React.createElement(Button, { onClick: () => onNavigate("actions") }, "View action queue"),
      React.createElement(Button, { variant: "outline", onClick: () => onNavigate("leads") }, "View leads"),
      React.createElement(Button, { variant: "outline", onClick: () => onNavigate("business") }, "Business context")
    )
  );
}
