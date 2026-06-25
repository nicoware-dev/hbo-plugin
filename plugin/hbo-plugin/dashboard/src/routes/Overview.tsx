import { getSDK } from "../api/client";
import { useFetch } from "../api/hooks";
import { BarChart } from "../components/BarChart";

type PageProps = { onNavigate: (page: string) => void };

type Stats = {
  funnel: Record<string, number>;
  segments: Record<string, number>;
  scoreBins: Record<string, number>;
  priorities: Record<string, number>;
  agentWorkload: Record<string, number>;
  signalTypes: Record<string, number>;
  totalLeads: number;
};

const FUNNEL_COLORS: Record<string, string> = {
  new: "#6366f1",
  needs_followup: "#f59e0b",
  hot: "#ef4444",
  converted: "#22c55e",
};

export function OverviewPage({ onNavigate }: PageProps) {
  const { React, components } = getSDK();
  const { Card, CardHeader, CardTitle, CardContent, Button } = components;
  const { data: ws, loading: wsLoading, error: wsError } = useFetch<Record<string, unknown>>("/workspace");
  const { data: stats, loading: statsLoading, error: statsError } = useFetch<Stats>("/stats");

  if (wsLoading || statsLoading) {
    return React.createElement("p", { style: { padding: "16px" } }, "Loading workspace…");
  }

  if (wsError || statsError) {
    return React.createElement(
      "div",
      { style: { padding: "16px", color: "#b91c1c" } },
      "Overview data unavailable. Restart Hermes dashboard after syncing the plugin.",
      React.createElement("p", { style: { fontSize: "13px", marginTop: "8px", color: "#6b7280" } }, wsError || statsError)
    );
  }

  const cards = [
    ["Active agents", ws?.activeAgents],
    ["Open signals", ws?.openSignals],
    ["Pending actions", ws?.pendingActions],
    ["Total leads", stats?.totalLeads ?? 0],
    ["Bridge mode", ws?.selectedBridge],
  ];

  return React.createElement(
    "div",
    { style: { display: "flex", flexDirection: "column", gap: "16px", padding: "16px" } },
    React.createElement("h2", { style: { fontSize: "18px", fontWeight: 600 } }, "Overview"),
    React.createElement(
      "div",
      { style: { display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" } },
      ...cards.map(([label, value]) =>
        React.createElement(
          Card,
          { key: String(label) },
          React.createElement(CardHeader, null, React.createElement(CardTitle, { className: "text-sm" }, label)),
          React.createElement(
            CardContent,
            null,
            React.createElement("p", { style: { fontSize: "24px", fontWeight: 700 } }, String(value ?? "—"))
          )
        )
      )
    ),
    React.createElement(
      "div",
      { style: { display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" } },
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
      { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
      React.createElement(Button, { onClick: () => onNavigate("actions") }, "View action queue"),
      React.createElement(Button, { variant: "outline", onClick: () => onNavigate("leads") }, "View leads"),
      React.createElement(Button, { variant: "outline", onClick: () => onNavigate("business") }, "Business context")
    )
  );
}
