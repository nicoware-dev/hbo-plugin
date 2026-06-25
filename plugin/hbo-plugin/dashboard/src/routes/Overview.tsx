import { getSDK } from "../api/client";
import { useFetch } from "../api/hooks";

type PageProps = { onNavigate: (page: string) => void };

export function OverviewPage({ onNavigate }: PageProps) {
  const { React, components } = getSDK();
  const { Card, CardHeader, CardTitle, CardContent, Button } = components;
  const { data, loading } = useFetch<Record<string, unknown>>("/workspace");

  if (loading) return React.createElement("p", null, "Loading workspace…");

  const cards = [
    ["Active agents", data?.activeAgents],
    ["Open signals", data?.openSignals],
    ["Pending actions", data?.pendingActions],
    ["Workspace", data?.workspaceName],
  ];

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Overview"),
    React.createElement(
      "div",
      { className: "grid gap-4 md:grid-cols-2" },
      ...cards.map(([label, value]) =>
        React.createElement(
          Card,
          { key: String(label) },
          React.createElement(CardHeader, null, React.createElement(CardTitle, null, label)),
          React.createElement(CardContent, null, React.createElement("p", { className: "text-2xl font-bold" }, String(value ?? "—")))
        )
      )
    ),
    React.createElement(
      Button,
      { onClick: () => onNavigate("actions") },
      "View action queue"
    )
  );
}
